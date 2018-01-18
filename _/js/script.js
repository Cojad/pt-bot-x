jQuery(document).ready(function ($) {
  // API REF
  const TABLE_REFS = getTableRefs($);

  // Global elements
  const $spinner = $('.spinner');
  const $lastUpdatedOn = $('#dvLastUpdatedOn, .monitor-summary');
  const $timeAgo = $('#spnTimeAgo');
  const $utcTime = $('#dvCurrentUTCTime');
  const $currentTime = $('#dvCurrentTime');
  const $configurationMenu = $('#configMenu');

  // Store for the server data.
  var serverData = {};
  var editor = '';
  var tableRecordsCount = {};
  var marketIcons = {
    BTC: 'fa fa-btc',
    USDT: 'fa fa-usd',
    BNB: 'fa fa-dot-circle-o',
    XMR: 'cf cf-xmr',
    ETH: 'cf cf-eth'
  };
  var onlySaveConfigFiles = ['trading/hotconfig'];

  // Initialize the services.
  var Service = Services(PBConstants.BASE_API_URL, PBConstants.MARKET_CAP_API_URL);
  var NormalizerService = Service.Normalizer;
  var ConfigurationService = Service.Configurations;

  function loadPage (isPageLoad) {

    // make the ajax call to get the data
    getServerData(function (data) {
      TABLE_REFS.cbUpdateDtCache(data);
      showOrHideConfigurationMenu(data);
      // update the UI elements
      updateLayoutItems(data);
      // Add api market value.
      addMarketValue();
      // routes variable will not have a property with querystring.
      var currentPath = window.history.state.path.split('?')[0];
      RouteHelper.showCurrentPage(routes, currentPath, isPageLoad, data);
    });
  }

  var routes = {
    'monitoring': {
      template: 'tmplMonitoring',
      heading: 'Monitoring',
      callback: cbMonitoring,
      refresh: true,
    },
    'totals-log': {
      template: 'tmplTotalLog',
      heading: 'Total Log',
      refresh: true,
    },
    'bot': {
      template: 'tmplBot',
      heading: 'BOT 管理',
      callback: cbBotControl,
      refresh: false
    },
    'config': {
      template: 'tmplConfig',
      heading: 'Configuration',
      callback: cbLoadConfig,
      refresh: false
    },
    'possible-buys-log': {
      template: 'tmplPossibleBuys',
      callback: TABLE_REFS.loadPossibleBuyData,
      heading: 'Possible Buy Log',
      json: 'bbBuyLogData',
      refresh: true,
    },
    'pairs-log': {
      template: 'tmplPairsLog',
      callback: cbPairLog,
      heading: 'Pairs Log',
      json: ['gainLogData', 'watchModeLogData'],
      refresh: true,
    },
    'pending-log': {
      template: 'tmplPendingLog',
      callback: cbPendingLog,
      heading: 'Pending Log ',
      json: 'pendingLogData',
      refresh: true,
    },
    'dca-log': {
      template: 'tmplDcaLog',
      callback: cbDcaLog,
      heading: 'Dca Log',
      json: 'dcaLogData',
      refresh: true,
    },
    'sales-log': {
      template: 'tmplSalesLog',
      callback: cbSalesLog,
      heading: 'Sales Log',
      json: 'sellLogData',
      refresh: true,
    },
    'dust-log': {
      template: 'tmplDustLog',
      callback: cbDustLog,
      heading: 'Dust Log',
      json: 'dustLogData',
      refresh: true,
    }
  };

  RouteHelper.init(routes);

  $timeAgo.timeago();

  addEventHandler();
  loadPage(true);
  ConfigurationService.setToastrOptions();
  showCurrentPage();
  intializeTooltips();
  addUTCTimer();
  scrollTopInLowerResolutions();
  handleWindowResize();
  handleConfigurationUnsavedChanges();

  function addEventHandler () {
    $(document).on('evt.before-page-load', function () {
      TABLE_REFS.destroyTable();
    });

    $(document).on('evt.add-market-value', function () {
      addMarketValue();
    });
  }

  function addMarketValue () {
    // Add api market value.
    $('.api-market').html(serverData.market);
  }


  /**
   * If a user tries to close the tab without saving then we should inform them.
   */
  function handleConfigurationUnsavedChanges () {
    window.addEventListener('beforeunload', function (event) {
      if (isConfigurationSaved()) {
        event.preventDefault();
      }
    });

    window.onbeforeunload = function (e) {
      if (isConfigurationSaved()) {
        var dialogText = 'Not saved';
        e.returnValue = dialogText;
        return dialogText;
      }
    };
  }

  function isConfigurationSaved () {
    return $('.show-save-message').hasClass('not-saved');
  }

  function hideConfigurationNotSaved () {
    $('.show-save-message').removeClass('not-saved').hide();
  }

  function scrollTopInLowerResolutions () {
    // On click on menu scroll to top.
    $('html').on('click', 'body.smallscreen #sidebar-menu li', function () {
      $('html,body').animate({
        scrollTop: '0px'
      }, 'slow');
    });
  }

  // Route to particular page based on the clicked tab.
  $('#sidebar-menu li, .main-heading').click(function (e) {

    // Check whether a user has unsaved changes and ask for confirmation.
    var resultsSaved = true;
    e.preventDefault();
    if (isConfigurationSaved()) {
      resultsSaved = confirm(PBConstants.CONFIGURATION_NOT_SAVED);
    }
    // If a user clicks on okay then switch to other tab
    // Otherwise stay in same tab.
    if (!resultsSaved) {
      return;
    }
    hideConfigurationNotSaved();
    // If a menu item is having sub menu then we should not close the sidebar.
    if (!$(this).hasClass('has_sub')) {
      // If window width is less than 770px then on click on menu item, hide the menu.
      // This is for fixing menu overlapping on tables in mobile resolutions.
      var windowWidth = $(window).width();
      if (windowWidth < PBConstants.MIN_WIDTH_TO_SHOW_MENU) {
        $('body').removeClass('widescreen').addClass('smallscreen');
        $('#wrapper').addClass('enlarged');
        $('.left ul').removeAttr('style');
      }
      removeHighlightRecordsCountInSideMenu($(this));
      var href = $(this).find('a').attr('href');
    }
    page(href);
  });

  /**
   * Show loading symbol when we are calling API.
   */
  function ajaxStartCb () {
    $lastUpdatedOn.hide();
    $spinner.show();
  }

  /**
   * Show last updated on after calling API.
   */
  function ajaxStopCb () {
    $spinner.hide();
    var UTCTime = DateTimeHelper.getUTCTime();
    var currentTime = new Date().toISOString();
    $timeAgo.timeago('update', currentTime).attr('title', UTCTime + ' UTC');
    // Show date and time.
    $lastUpdatedOn.show();
  }

  /**
   * Get data from the server
   * @param {any} cbMain - Callback method to be called after data is fetch.
   */
  function getServerData (cbMain) {
    /*
    ajaxStartCb();
    $.when(Service.getTableData(), Service.getMarketCap(), Service.getMarketTrend())
      .done(function (tableData, marketCap, marketTrend) {
        var responseData = cbServerData(tableData[0], marketCap[0], marketTrend[0]);
        if (responseData.processStatus === false) {
          toastr.error(PBConstants.AJAX_ERROR_MSG);
        }
        serverData = responseData;
        cbMain(responseData);
      }).fail(function () {
        toastr.error(PBConstants.AJAX_ERROR_MSG);
      }).always(function () {
        ajaxStopCb();
        // lets now set a timer again for refresh
        // this will be set even if there is an error.
        setTimeout(loadPage, PBConstants.REFRESH_TIMER);
      });*/
  }

  function cbServerData (tableData, marketCapData, marketTrend) {
    var responseData = tableData;
    responseData.processStatus = true;

    responseData.coinMarketCap =
      NormalizerService.marketCap(marketCapData, PBConstants.MARKET_CAP_CURRENCY);
    if (responseData.coinMarketCap === false) {
      responseData.processStatus = false;
      responseData.coinMarketCap = {
        percChange1h: 0,
        percChange24h: 0,
        percChange7d: 0,
      };
    }

    responseData.marketTrendAvg =
      NormalizerService.marketTrend(marketTrend, responseData.market);
    if (responseData.marketTrendAvg === false) {
      responseData.processStatus = false;
      responseData.marketTrendAvg = 0;
    }

    return responseData;
  }

  function showCurrentPage () {
    var isFound = false;
    // Check on which page we are and route to that particular page.
    $.each(routes, function (path) {
      var URL = window.location.href;
      if (URL.indexOf(path) !== -1) {
        $('#sidebar-menu [href="' + path + '"]').addClass('subdrop');
        isFound = true;
        // If a URL consists of query string then we have to pass query string also to page function.
        var URLArr = URL.split('?');
        path = URLArr[1] ? path + '?' + URLArr[1] : path;
        page(path);
        return;
      }
    });

    if (!isFound) {
      showMonitoring();
    }
  }

  /**
   * It redirects to monitoring page.
   */
  function showMonitoring () {
    page('bot');
    $('#defaultPage a').addClass('subdrop');
    $("#configBot ul").slideDown(350);
    //$("#configBot a:first()").addClass("subdrop");


  }

  function intializeTooltips () {
    $('[data-toggle="tooltip"]').tooltip('dispose').tooltip();
  }

  /**
   * Callback function called after the data has been retrieved.
   * @param {any} data
   */
  function updateLayoutItems (data) {
    // Load current page table data.
    try {
      cbUpdateNavbar(data);
      cbUpdateFooter(data);
      cbUpdateTitle(data);
    } catch (e) {
      console.error(e);
      // show a message to the user.
      toastr.error(PBConstants.PROCESSING_ERR);
    }
  }

  /** ******************************
   * START of page load callbacks
   *******************************/

  function cbPairLog (gainLogData, watchModeLogData) {
    var sumVals = TABLE_REFS.loadPairLogsData(gainLogData, watchModeLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'pairsLogDifference');
    $('#pairsLogTotalCurrentVal').html((sumVals.currentValue).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#pairsLogRealCost').html((sumVals.totalCost).toFixed(PBConstants.DEFAULT_PRECISION));
  }

  function cbDustLog (dustLogData) {
    var sumVals = TABLE_REFS.loadDustLogsData(dustLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'dustLogDifference');
    $('#dustLogTotalCurrentVal').html((sumVals.currentValue).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#dustLogRealCost').html((sumVals.totalCost).toFixed(PBConstants.DEFAULT_PRECISION));
  }

  function cbDcaLog (dcaLogData) {
    var sumVals = TABLE_REFS.loadDcaLogsData(dcaLogData);
    addDifference(sumVals.currentValue, sumVals.totalCost, 'dcLogDifference');
    $('#dcLogTotalCurrentVal').html((sumVals.currentValue).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#dcLogRealCost').html((sumVals.totalCost).toFixed(PBConstants.DEFAULT_PRECISION));
  }

  function cbPendingLog (pendingLogData) {
    let sumVals = TABLE_REFS.loadPendingLogsData(pendingLogData);
    var currentValue = sumVals.currentValue;
    addDifference(sumVals.currentValue, sumVals.totalCost, 'pendingLogDifference');
    $('#pendingLogTotalCurrentVal').html((currentValue).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#pendingLogRealCost').html(((sumVals.totalCost)).toFixed(PBConstants.DEFAULT_PRECISION));
  }

  function cbSalesLog (salesLogData) {
    var sumVals = TABLE_REFS.loadSellLogData(salesLogData);
    $('#salesLogTotalCurrentVal').html((sumVals.soldValue).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#salesLogBoughtCost').html((sumVals.boughtCost).toFixed(PBConstants.DEFAULT_PRECISION));
    addDifferencesales(sumVals.boughtCost, sumVals.soldValue, 'salesLogDifference');
  }

  /**
   * It adds difference value and percentage in the summary table.
   * @param {*} difference
   * @param {*} element
   */
  function addDifference (firstValue, secondValue, element) {
    var difference = firstValue - secondValue;
    var diffPerTmp = +firstValue ? (difference / secondValue) * 100 : 0;
    var differencePerClass = diffPerTmp < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var differencePer = ' (' + (diffPerTmp).toFixed(2) + ' %)';
    $('#' + element + ' .value').html((difference).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#' + element + ' .percentage').html((differencePer)).removeClass(PBConstants.POSSIBLE_CLASSES).addClass(differencePerClass);
  }

  function addDifferencesales (firstValue, secondValue, element) {
    var difference = secondValue - firstValue;
    var diffPerTmp = +firstValue ? (difference / firstValue) * 100 : 0;
    var differencePerClass = diffPerTmp < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var differencePer = ' (' + (diffPerTmp).toFixed(2) + ' %)';
    $('#' + element + ' .value').html((difference).toFixed(PBConstants.DEFAULT_PRECISION));
    $('#' + element + ' .percentage').html((differencePer)).removeClass(PBConstants.POSSIBLE_CLASSES).addClass(differencePerClass);
  }

  function cbMonitoring (data) {
    intializeTooltips();
    var summary = NormalizerService.getMonitoringSummary(data);
    var tablesInfo = getTablesInfo(data);
    if (!summary || !tablesInfo) {
      return;
    }
    var normalizedSummary = NormalizerService.normalizeSummaryData(summary);

    // Tables summary
    // DCA log table summary.
    var dcLogsData = tablesInfo['dca-log'];
    jQuery('#mDcLogCurrentValue').html(dcLogsData.currentValue);
    jQuery('#mDcLogBoughtCost').html(dcLogsData.boughtCost);
    addDifference(dcLogsData.currentValue, dcLogsData.boughtCost, 'mDcLogDifference');

    // Pairs log table summary.
    var pairsLogData = tablesInfo['pairs-log'];
    jQuery('#mPairsLogCurrentValue').html(pairsLogData.currentValue);
    jQuery('#mPairsLogBoughtCost').html(pairsLogData.boughtCost);
    addDifference(pairsLogData.currentValue, pairsLogData.boughtCost, 'mPairsLogDifference');

    // Pending log table summary.
    var pendingLogData = tablesInfo['pending-log'];
    jQuery('#mPendingLogCurrentValue').html(pendingLogData.currentValue);
    jQuery('#mPendingLogBoughtCost').html(pendingLogData.boughtCost);
    addDifference(pendingLogData.currentValue, pendingLogData.boughtCost, 'mPendingLogDifference');

    // Sales log table summary
    var salesLogData = tablesInfo['sales-log'];
    jQuery('#mSalesLogCurrentValue').html(salesLogData.currentValue);
    jQuery('#mSalesLogBoughtCost').html(salesLogData.boughtCost);
    addDifferencesales(salesLogData.boughtCost, salesLogData.currentValue, 'mSalesLogDifference');
    var firstRowElementsObjObj = {
      balance: ['mBalanceVal', '', 'balance'],
      totalCurrentVal: ['mTotalCurrentVal', '', 'totalCurrentVal'],
      totalPendingVal: ['mTotalPendingVal', '', 'totalPendingVal'],
      lastWeekProfit: ['mLastWeekProfit', '', 'lastWeekProfit'],
      yesterdayProfit: ['mYesterdayProfit', '', 'yesterdayProfit'],
      todayProfit: ['mTodayProfit', '', 'todayProfit'],
      balMarketPrice: ['mBalUSDValue'],
      TCVMarketPrice: ['mTCVUSDValue'],
      TPVMarketPrice: ['mTPVUSDValue'],
      lastWeekProfitUSDValue: ['mLastWeekProfitUSDValue', '', 'lastWeekProfitUSDValue'],
      yesterdayProfitUSDValue: ['mYesterdayProfitUSDValue', '', 'yesterdayProfitUSDValue'],
      todayProfitUSDValue: ['mTodayProfitUSDValue', '', 'todayProfitUSDValue']
    };
    DomHelper.checkAndBindData(firstRowElementsObjObj, normalizedSummary);
    var secondRowElementsObj = {
      percChange1h: ['mTrend1h', 'percChange1hClass'],
      percChange24h: ['mTrend24h', 'percChange24hClass'],
      percChange7d: ['mTrend7d', 'percChange7dClass'],
      marketTrendAvg: ['mMarketTrend', 'marketTrendAvgClass', 'marketTrendAvg'],
      priceUsd: ['mBtcPrice'],
      pendingOrderTime: ['mPendingOrderTime'],
      sellOnlyMode: ['mSellOnlyMode'],
      sellOnlyModeOverride: ['mSellOnlyModeOverride']
    };
    DomHelper.checkAndBindData(secondRowElementsObj, summary, PBConstants.POSSIBLE_CLASSES, summary);
    $('#mMarketTrendLabel').html(summary.apiMarket + ' Trend 24H');
    $('#mMarketTrendContainer').attr('data-original-title', 'The % trend of the top ' + summary.apiMarket + ' coins from your market the last 24 hours');
    jQuery('.market').html(summary.apiMarket);
    jQuery('#mExchange').html(data.exchange);
    jQuery('#mMarket').html(summary.apiMarket);
    jQuery('#mVersion').html(data.version);
    jQuery('#mBtc24h').html('(' + summary.percBtcChange24h + ')').removeClass(PBConstants.POSSIBLE_CLASSES)
      .addClass(summary.percChange24hBtcClass);
    jQuery('#mSellOnlyModeLabel').attr('data-original-title', summary.sellOnlyModeToolTip);
    changeMarketIcons(summary.apiMarket);
    var $marketPriceCalculations = $('.market-price-calculations');
    if (summary.apiMarket === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD) {
      $marketPriceCalculations.hide();
    } else {
      $marketPriceCalculations.show();
    }
  }

  /**
   * Removes all the previously added market icons and adds current market icon in monitoring first row.
   * @param {*} market
   */
  function changeMarketIcons (market) {
    var $marketIconElement = $('.market-icon');
    // Generate all market icons array.
    var possibleMarketIconsArr = $.map(marketIcons, function (icon) {
      return [icon];
    });
    var currentMarketIcon = marketIcons.hasOwnProperty(market) ? marketIcons[market] : marketIcons.BTC;
    DomHelper.replaceClasses($marketIconElement, possibleMarketIconsArr, currentMarketIcon);
  }

  function cbUpdateNavbar (data) {
    var summaryTemp = NormalizerService.getMonitoringSummary(data);
    var tables = ['pairs-log', 'pending-log', 'dca-log', 'possible-buys-log', 'sales-log', 'dust-log'];
    var oldTableRecordsCount = tableRecordsCount;
    var currentPage = window.history.state.path;
    var navBarElements = {
      'possible-buys-log': ['possibleBuyLogLength'],
      'pairs-log': ['pairsLogLength'],
      'pending-log': ['pendingLogLength'],
      'sales-log': ['salesLogLength'],
      'dca-log': ['dcLogLength'],
      'dust-log': ['dustLogLength']
    };
    tableRecordsCount = NormalizerService.getTablesRecordsCount(data, routes, tables);
    if (!summaryTemp && !tableRecordsCount) {
      return;
    }
    // Records count in side menu
    highlightRecordsCountInSideMenu(oldTableRecordsCount, tableRecordsCount, currentPage, navBarElements);

    var summary = NormalizerService.normalizeSummaryData(summaryTemp, 2);
    var precisionTo3 = {
      balance: 'balance',
      totalCurrentVal: 'totalCurrentVal',
      totalPendingVal: 'totalPendingVal',
    };
    var nrmlsdTmpData = NormalizerService.addPrecisionForMultipleValues(precisionTo3, summaryTemp, 3);
    $.extend(summary, nrmlsdTmpData);
    $('.monitor-summary').hide();
    var navBarElementsObj = {
      balance: ['nBalanceVal', '', 'balance'],
      totalCurrentVal: ['nTotalCurrentVal', '', 'totalCurrentVal'],
      totalPendingVal: ['nTotalPendingVal', '', 'totalPendingVal'],
      marketTrendAvg: ['nMarketTrend', 'marketTrendAvgClass', 'marketTrendAvg'],
      normalisedMarketPrice: ['nMarketPrice', '', 'normalisedMarketPrice'],
      normalisedMarket: ['nMarket', '', 'marketTitle'],
      lastWeekProfit: ['nLastWeekProfit', '', 'lastWeekProfit'],
      yesterdayProfit: ['nYesterdayProfit', '', 'yesterdayProfit'],
      todayProfit: ['nTodayProfit', '', 'todayProfit']
    };
    DomHelper.checkAndBindData(navBarElementsObj, summary, PBConstants.POSSIBLE_CLASSES, summary);
    jQuery('#nMarketPercChange').html('(' + summary.normalisedMarketPercChange + ')').attr('title', summary.normalisedMarketPercChange)
      .removeClass(PBConstants.POSSIBLE_CLASSES).addClass(summary.normalisedMarketPercChangeClass);
    $('#nMarketTrendLabel').attr('title', 'Trend ' + summary.apiMarket);
    $('.monitor-summary').show();
    var monitorInfoMblTxt = $($('.monitor-summary').get(0).outerHTML).addClass('mointor-summary-title').removeClass('monitor-summary').get(0).outerHTML;
    $('.monitor-info-mbl').find('a').attr('data-original-title', monitorInfoMblTxt);
    updateSubHeader(data);
  }

  /**
   * It highlights the records count in side menu if they got changed.
   * @param {*} oldTableRecordsCount
   * @param {*} tableRecordsCount
   * @param {*} currentPage
   * @param {*} navBarElements
   */
  function highlightRecordsCountInSideMenu (oldTableRecordsCount, tableRecordsCount, currentPage, navBarElements) {
    var classedObj = {};
    // On page load oldTablerecordscount will be empty.
    if (!$.isEmptyObject(oldTableRecordsCount)) {
      // Should not highlight current page records count.
      delete oldTableRecordsCount[currentPage];
      for (var table in oldTableRecordsCount) {
        // If previous records count and current records count are not equal then highlight that records count.
        if (oldTableRecordsCount[table] !== tableRecordsCount[table]) {
          classedObj[table] = PBConstants.RECORDS_COUNT_HIGHLIGHT_CLASS;
          navBarElements[table].push(table);

        }
      }
    }
    DomHelper.checkAndBindData(navBarElements, tableRecordsCount, '', classedObj);
  }

  /**
   * When a user clicks on menu item then remove records count highlighted color in side menu
   * and show in normal color.
   */
  function removeHighlightRecordsCountInSideMenu ($currentMenuItem) {
    $currentMenuItem.find('.records-count').removeClass(PBConstants.RECORDS_COUNT_HIGHLIGHT_CLASS);
  }

  function cbUpdateFooter (data) {
    data.detectedConfigurationChanges = getConfigurationLatestChangeDate(data);
    var elems = {
      version: ['apiVersion'],
      pendingOrderTime: ['apiPendingOrderTime'],
      detectedConfigurationChanges: ['apiDetectedConfigurationChanges']
    };
    DomHelper.checkAndBindData(elems, data);
  }

  /**
   * It returns configuration latest change date in server timezone.
   * @param {*} data
   */
  function getConfigurationLatestChangeDate (data) {
    if (!data.notifications || $.isEmptyObject(data.notifications)) {
      return '--';
    }
    var notifications = data.notifications ? data.notifications : {};
    var notificationsTimeArr = Object.keys(notifications).sort(); // It return an array with object properties.
    var confLatestChangeDateTmp = notificationsTimeArr[notificationsTimeArr.length - 1];
    var nrmlsedDate = DateTimeHelper.addTimeZoneOffset(serverData.timeZoneOffset, confLatestChangeDateTmp);
    var confLatestChangeDate = notifications[confLatestChangeDateTmp] + ': ' + nrmlsedDate;
    return confLatestChangeDate;
  }

  /**
   * It updates second header.
   * @param {*} dataTmp
   */
  function updateSubHeader (dataTmp) {
    var data = $.extend(dataTmp, NormalizerService.getSellModeData(dataTmp));
    var elems = {
      exchange: ['apiExchange'],
      market: ['apiMarket'],
      sellOnlyMode: ['apiSellOnlyMode', 'sellOnlyModeClass'],
      sellOnlyModeOverride: ['apiSellOnlyModeOverride', 'sellOnlyModeOverrideClass']
    };
    DomHelper.checkAndBindData(elems, data, PBConstants.NEGATIVE_CLASS_TEXT, data);
    $('#apiSellOnlyModeLabel').attr('data-original-title', data.sellOnlyModeToolTip);
  }


  function cbUpdateTitle (data) {
    if (data.sitename) {
      document.title = data.sitename;
    } else {
      document.title = PBConstants.TITLE_PROFIT_TRAILER;
    }
  }

  // On window resize set ace editor height.
  function handleWindowResize () {
    var resized;
    $(window).on('resize orientationChanged', function () {
      clearTimeout(resized);
      resized = setTimeout(setConfigurationContainerHeight, 400);
    });
  }

  // On click on save button call save api
  $('body').on('click', '.save-config', function () {
    var queryString = getUrlVars();
    var filename = queryString.file || 'configuration.properties';
    var updatedData = editor.getValue();
    // Set configuration data
    Service.saveConfigFile(filename, updatedData).done(function (data, textStatus, jqXHR) {
      if (jqXHR.status === PBConstants.SUCCESS_CODE) {
        hideConfigurationNotSaved();
        toastr.success(PBConstants.CONFIGURATION_SUCCESS_MSG);
      } else {
        toastr.error(PBConstants.AJAX_ERROR_MSG);
      }

    });
  });

  /**
   * It hides the configuration menu if enable config property
   * is false. It shows the configuration menu if enable config property
   * is true.
   * @param {*} data
   */
  function showOrHideConfigurationMenu (data) {
    if (data.hasOwnProperty('settings') && data.settings.hasOwnProperty('enableConfig') && data.settings.enableConfig === 'true') {
      $configurationMenu.show();
    } else {
      $configurationMenu.hide();
      // If a user is in configuration pages then redirect to monitoring page and
      // collapse the configuration menu
      var currentPath = window.history.state.path;
      if (currentPath.indexOf('config') !== -1) {
        $configurationMenu.find('a').trigger('click');
        // In lower resolutions
        var lowerResolutionsMenu = $('.smallscreen #configMenu a');
        if (lowerResolutionsMenu.length) {
          lowerResolutionsMenu.trigger('touchstart');
        }
        showMonitoring();
      }
    }
  }

  function cbBotControl () {
		setConfigurationContainerHeight();
  }
  $('body').on('click', '.bot-on', function () {
		$.post( '/x/on')
  	.done(function(data) {
    	alert( data );
  	})
  	.fail(function() {
    	alert( 'error' );
  	})
  });
  $('body').on('click', '.bot-off', function () {
		$.post( '/x/off')
  	.done(function(data) {
    	alert( data );
  	})
  	.fail(function() {
    	alert( 'error' );
  	})
  });
  $('body').on('click', '.bot-clear', function () {
    $.post( '/x/clear')
    .done(function(data) {
      $("#logIFrame").attr('src',$("#logIFrame").attr('src'));
      console.log("clear");
    })
    .fail(function() {
      alert( 'error' );
    })
  });
  function cbLoadConfig () {
    if (editor) {
      editor.destroy();
    }
    // Get current path with query string
    var currentPath = 'config' + window.location.search;
    var $configurationLink = $('#sidebar-menu [href="' + currentPath + '"]');

    // If a configuration link is not highlighted then trigger links click events.
    if ($configurationLink.length && $configurationLink.parents('.has_sub').find('.subdrop').length < 1) {
      // Click on links.
      $('#sidebar-menu .config').trigger('touchstart').trigger('click');
      $configurationLink.trigger('touchstart').trigger('click');
      return;
    }

    // Set heading
    var currentConfiguration = $('.subdrop').last().text();
    currentConfiguration ? $('#configurationHeading').html(currentConfiguration) : '';
    // Set ace editor height
    setConfigurationContainerHeight();
    editor = ace.edit('PBConfigEditor');
    editor.focus();
    ConfigurationService.editorConfiguration(editor);
    var queryString = getUrlVars();
    var filename = queryString.file || 'configuration.properties';
    // For some config files there is no get functionality only save functionality is there.
    if ($.inArray(filename, onlySaveConfigFiles) === -1) {
      // Get configuration data only
      Service.getConfigFile(filename).done(function (data) {
        if (data) {
          data = $.isArray(data) ? data.join('\n') : data;
          editor.setValue(data, -1);
          hideConfigurationNotSaved();
        } else {
          toastr.error(PBConstants.AJAX_ERROR_MSG);
        }
      });
    }
    handleEditorContentChange(editor);
  }

  /**
   * When a user changes some thing in ace editor then show not saved error message.
   * @param {*} editor
   */
  function handleEditorContentChange (editor) {
    editor.getSession().on('change', function () {
      $('.show-save-message').show().addClass('not-saved');
    });
  }

  /**
   * Set ace editor height
   */
  function setConfigurationContainerHeight () {
    var occupiedHeight = $('.editor-container').position().top + $('.footer').outerHeight() + PBConstants.HEIGHT_REMOVE_TO_FIX_SCROLLBAR;
    var remainingHeight = $(window).outerHeight() - occupiedHeight;
    $('.editor-container').css('height', remainingHeight + 'px');
    editor ? editor.resize() : '';
  }

  /** ******************************
   * END of page load callbacks
   *******************************/


  /**
   * Get tables summary.
   * @param {*} data
   */
  function getTablesInfo (data) {
    if (!data.coinMarketCap) {
      return false;
    }

    var summaryTables = ['pairs-log', 'pending-log', 'dca-log', 'sales-log'];
    var returnObj = {};
    // Loop over the tables and get summary values.
    for (var i = 0; i < summaryTables.length; i++) {
      var summaryTable = summaryTables[i];
      var jsonProp = routes[summaryTable].json;
      // Some routes have two json properties, we have to concat both properties data.
      var summaryTableData = Array.isArray(jsonProp) && Array.isArray(data[jsonProp[1]]) ? data[jsonProp[0]].concat(data[jsonProp[1]]) : data[jsonProp];
      summaryTableData = summaryTableData ? summaryTableData : [];
      var currentValue = 0;
      var boughtCost = 0;
      var currentValueTmp;
      if (summaryTable === 'sales-log') {
        for (var j = 0; j < summaryTableData.length; j++) {
          var currentObjSalesLog = summaryTableData[j];
          currentValueTmp = (currentObjSalesLog.soldAmount * currentObjSalesLog.currentPrice);
          currentValue += DataTableHelper.getCurrentValueBsdOnfee(currentObjSalesLog, currentValueTmp);
          boughtCost += currentObjSalesLog.soldAmount * currentObjSalesLog.averageCalculator.avgPrice;
        }
      } else {
        for (var k = 0; k < summaryTableData.length; k++) {
          var currentObj = summaryTableData[k];
          currentValueTmp = (currentObj.averageCalculator.totalAmount * currentObj.currentPrice);
          currentValue += DataTableHelper.getCurrentValueBsdOnfee(currentObj, currentValueTmp);
          boughtCost += currentObj.averageCalculator.totalCost;
        }
      }
      returnObj[summaryTable] = {
        currentValue: currentValue.toFixed(PBConstants.DEFAULT_PRECISION),
        boughtCost: boughtCost.toFixed(PBConstants.DEFAULT_PRECISION)
      };
    }
    return returnObj;
  }

  function addUTCTimer () {
    var utcTime = DateTimeHelper.getUTCTimeOnly();
    var currentTime = DateTimeHelper.getCurrentTimeZoneTime(serverData.timeZoneOffset);
    $utcTime.html(utcTime);
    $currentTime.html(currentTime);
    setTimeout(addUTCTimer, 500);
  }

  function getUrlVars () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
});
