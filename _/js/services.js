/** ******************************************************
 * Contains all the code related to API calls, normalization
 * of data received from the API, and configuration of
 * plugins.
 *
 * © ProfitTrailer
 ********************************************************/
var Services = function (baseAPI, marketCapAPI) {
  var BASE_API = baseAPI;
  var MARKET_CAP_API_URL = marketCapAPI;

  var DEFAULT_REQUEST_OBJ = {
    cache: false,
    crossDomain: true,
    dataType: 'json'
  };

  var CONFIG_REQUEST_OBJ = jQuery.extend({
    beforeSend: function () {
      $('.tab-specific-loading').show();
    },
    error: function () {
      toastr.error(PBConstants.AJAX_ERROR_MSG);
    },
    complete: function () {
      $('.tab-specific-loading').hide();
    }
  }, DEFAULT_REQUEST_OBJ);

  function getTableData () {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/monitoring/data',
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getMarketCap () {
    return $.ajax(jQuery.extend({
      url: MARKET_CAP_API_URL,
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getMarketTrend () {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/private?command=returnTicker',
      global: false
    }, DEFAULT_REQUEST_OBJ));
  }

  function getConfigFile (filename) {
    return $.ajax(jQuery.extend({
      url: BASE_API + '/x/load',

      data: {
        fileName: filename
      },
      global: false
    }, CONFIG_REQUEST_OBJ));
  }

  function saveConfigFile (filename, fileData) {
    var configRequestObject = Object.assign({}, CONFIG_REQUEST_OBJ);
    return $.ajax(jQuery.extend(configRequestObject, {
      url: BASE_API + '/x/save?fileName=' + filename,
      data: fileData,
      dataType: 'text',
      contentType: 'text/plain',
      global: false,
      type: 'POST'
    }));
  }

  return {
    getTableData: getTableData,
    getMarketCap: getMarketCap,
    getMarketTrend: getMarketTrend,
    getConfigFile: getConfigFile,
    saveConfigFile: saveConfigFile,
    Normalizer: Services.Normalizer(),
    Configurations: Services.Configurations()
  };
};

// Configurations.
Services.Configurations = function () {
  function setToastrOptions () {
    toastr.options = {
      closeButton: true,
      newestOnTop: true,
      positionClass: 'toast-top-right',
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      preventDuplicates: true
    };
  }

  function editorConfiguration (editor) {
    editor.setTheme('ace/theme/twilight');
    editor.getSession().setMode('ace/mode/properties');
  }

  return {
    setToastrOptions: setToastrOptions,
    editorConfiguration: editorConfiguration
  };
};

// Data normalization
Services.Normalizer = function () {
  function marketCap (data, marketCapCurrency) {
    try {
      var percChange1h = 0;
      var percChange24h = 0;
      var percChange7d = 0;
      var totalRecords = data ? data.length : 0;

      for (var i = 0; i !== totalRecords; ++i) {
        if (data[i].symbol === marketCapCurrency) {
          // exclude bitcoin in the trend
          continue;
        }
        percChange1h += +data[i].percent_change_1h;
        percChange24h += +data[i].percent_change_24h;
        percChange7d += +data[i].percent_change_7d;
      }

      percChange1h = percChange1h / totalRecords;
      percChange24h = percChange24h / totalRecords;
      percChange7d = percChange7d / totalRecords;
    } catch (e) {
      console.log('Error while processing data from market cap API.');
      console.log(e);
      return false;
    }

    return {
      percChange1h: percChange1h,
      percChange24h: percChange24h,
      percChange7d: percChange7d,
    };
  }

  /**
   * If market is USDT then we should consider market as BTC.
   * @param {*} market
   */
  function normalizeMarket (market) {
    market = market === PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD ? 'BTC' : market;
    return market;
  }

  function normalizeSummaryData (summary, precision) {
    // Don't modify the original object.
    var summaryTemp = $.extend({}, summary);
    var normalizedSummary = summaryTemp;
    var precisionToUse = precision || PBConstants.DEFAULT_PRECISION;
    normalizedSummary.balance = (+summaryTemp.balance).toFixed(precisionToUse);
    normalizedSummary.totalCurrentVal = (+summaryTemp.totalCurrentVal).toFixed(precisionToUse);
    normalizedSummary.totalPendingVal = (+summaryTemp.totalPendingVal).toFixed(precisionToUse);
    normalizedSummary.todayProfit = (+summaryTemp.todayProfit).toFixed(precisionToUse);
    normalizedSummary.yesterdayProfit = (+summaryTemp.yesterdayProfit).toFixed(precisionToUse);
    normalizedSummary.lastWeekProfit = (+summaryTemp.lastWeekProfit).toFixed(precisionToUse);

    for (var prop in normalizedSummary) {
      if ((typeof normalizedSummary[prop] === undefined) ||
        (typeof (normalizedSummary[prop]) === 'string' && normalizedSummary[prop].toLowerCase() === 'nan')) {
        normalizedSummary[prop] = '--';
      }
    }
    return normalizedSummary;
  }

  function marketTrend (data, marketCapCurrency) {
    var marketTrend = 0;
    var marketTrendAvg = 0;
    try {
      var marketRecords = 0;
      for (var key in data) {
        // Consider coins contains marketCapCurrency
        if (key.indexOf(marketCapCurrency) !== -1) {
          var value = JSON.parse(data[key]);
          marketTrend += +value.percentChange * 100;
          ++marketRecords;
        }
      }
      marketTrendAvg = marketRecords ? marketTrend / marketRecords : 0;
    } catch (e) {
      console.error('Error while processing data from market Trend API');
      console.error(e);
      return false;
    }
    return marketTrendAvg;
  }

  function getTablesRecordsCount (data, routes, tables) {
    if (!data || $.isEmptyObject(data)) {
      return false;
    }
    var recordsCount = {};
    for (var i = 0; i < tables.length; i++) {
      var currentTable = tables[i];
      var jsonProp = routes[currentTable].json;
      // Some routes have two json properties, we have to concat both properties data.
      var currentTabledata = Array.isArray(jsonProp) && Array.isArray(data[jsonProp[1]]) ? data[jsonProp[0]].concat(data[jsonProp[1]]) : data[jsonProp];
      recordsCount[currentTable] = currentTabledata.length;
    }
    return recordsCount;
  }

  function getMonitoringSummary (data, lowerPrecision) {
    var precision = PBConstants.DEFAULT_PRECISION;
    if (lowerPrecision) {
      precision = 3;
    }
    if (!data.coinMarketCap) {
      return false;
    }
    var percChange1hClass = data.coinMarketCap.percChange1h < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var percChange24hClass = data.coinMarketCap.percChange24h < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var percChange7dClass = data.coinMarketCap.percChange7d < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var percChange24hBtcClass = data.BTCUSDTPercChange < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;
    var marketTrendAvgClass = data.marketTrendAvg < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;

    var normalisedMarket = normalizeMarket(data.market);
    var normalisedMarketPrice = data[normalisedMarket + 'USDTPrice'] ? data[normalisedMarket + 'USDTPrice'] : 0;
    var normalisedMarketPercChange = data[normalisedMarket + 'USDTPercChange'] ? data[normalisedMarket + 'USDTPercChange'] : 0;
    var normalisedMarketPercChangeClass = normalisedMarketPercChange < 0 ? PBConstants.NEGATIVE_CLASS_TEXT : PBConstants.POSITIVE_CLASS_TEXT;

    var marketTmp = data.market;
    var marketPrice = data[marketTmp + 'USDTPrice'] ? data[marketTmp + 'USDTPrice'] : 0;
    var marketPriceClass = data.market === PBConstants.HIDE_MARKET_PRICE_ROW_COMPARISION ? 'hide' : 'show';

    var returnDataTmp = {
      balance: data.balance,
      todayProfit: data.totalProfitToday,
      yesterdayProfit: data.totalProfitYesterday,
      lastWeekProfit: data.totalProfitWeek,
      totalCurrentVal: (data.totalPairsCurrentValue + data.totalDCACurrentValue +
        data.totalPendingCurrentValue + data.balance).toFixed(precision),
      totalPendingVal: (data.totalPairsRealCost + data.totalDCARealCost +
        data.totalPendingTargetPrice + data.balance).toFixed(precision),
      percChange1h: data.coinMarketCap.percChange1h.toFixed(2) + ' %',
      percChange24h: data.coinMarketCap.percChange24h.toFixed(2) + ' %',
      percChange7d: data.coinMarketCap.percChange7d.toFixed(2) + ' %',
      percBtcChange24h: checkAndAddPrecision(data.BTCUSDTPercChange * 100, 2) + ' %',
      normalisedMarketPercChange: checkAndAddPrecision(normalisedMarketPercChange * 100, 2) + ' %',
      marketTrendAvg: checkAndAddPrecision(data.marketTrendAvg, 2) + ' %',
      percChange24hBtcClass: percChange24hBtcClass,
      normalisedMarketPercChangeClass: normalisedMarketPercChangeClass,
      priceUsd: checkAndAddPrecision(data.BTCUSDTPrice, 2),
      normalisedMarketPrice: checkAndAddPrecision(normalisedMarketPrice, 2),
      percChange1hClass: percChange1hClass,
      percChange24hClass: percChange24hClass,
      percChange7dClass: percChange7dClass,
      marketTrendAvgClass: marketTrendAvgClass,
      apiMarket: data.market,
      normalisedMarket: normalisedMarket,
      marketTitle: normalisedMarket + 'USD Price',
      pendingOrderTime: data.pendingOrderTime,
      balMarketPrice: (data.balance * marketPrice).toFixed(2),
      marketPriceClass: marketPriceClass
    };
    var marketPriceValues = {
      TPVMarketPrice: (marketPrice * returnDataTmp.totalPendingVal).toFixed(2),
      TCVMarketPrice: (marketPrice * returnDataTmp.totalCurrentVal).toFixed(2),
      todayProfitUSDValue: checkAndAddPrecision(marketPrice * returnDataTmp.todayProfit, 2),
      yesterdayProfitUSDValue: checkAndAddPrecision(marketPrice * returnDataTmp.yesterdayProfit, 2),
      lastWeekProfitUSDValue: checkAndAddPrecision(marketPrice * returnDataTmp.lastWeekProfit, 2),
    };
    returnDataTmp = $.extend(returnDataTmp, marketPriceValues);
    var returnData = $.extend(returnDataTmp, getSellModeData(data));
    return returnData;
  }

  /**
  * It is to fix .toFixed not defined error
  * this error will occur when value is not an integer.
  * @param {*} value
  * @param {*} precisionTmp
  */
  function checkAndAddPrecision (value, precisionTmp) {
    var returnVal = value ? +value : 0;
    var precision = precisionTmp ? precisionTmp : PBConstants.DEFAULT_PRECISION;
    return returnVal.toFixed(precision);
  }

  function addPrecisionForMultipleValues (originalObj, data, precision) {
    for (var key in originalObj) {
      originalObj[key] = checkAndAddPrecision(data[originalObj[key]], precision);
    }
    return originalObj;
  }

  function getSellModeData (data) {
    var returnObj = {
      sellOnlyMode: '',
      sellOnlyModeOverride: '',
      sellOnlyModeToolTip: ''
    };
    if (data.settings) {
      returnObj = {
        sellOnlyMode: data.settings.hasOwnProperty('sellOnlyMode') ? data.settings.sellOnlyMode.toString() : '',
        sellOnlyModeClass: data.settings.hasOwnProperty('sellOnlyMode') && data.settings.sellOnlyMode ? PBConstants.NEGATIVE_CLASS_TEXT : '',
        sellOnlyModeOverride: data.settings.hasOwnProperty('sellOnlyModeOverride') ? data.settings.sellOnlyModeOverride.toString() : '',
        sellOnlyModeOverrideClass: data.settings.hasOwnProperty('sellOnlyModeOverride') && data.settings.sellOnlyModeOverride ? PBConstants.NEGATIVE_CLASS_TEXT : '',
        sellOnlyModeToolTip: data.settings.sellOnlyMode && data.settings.sellOnlyModeTrigger ? data.settings.sellOnlyModeTrigger : ''
      };
    }
    return returnObj;
  }

  return {
    marketCap: marketCap,
    marketTrend: marketTrend,
    normalizeSummaryData: normalizeSummaryData,
    getTablesRecordsCount: getTablesRecordsCount,
    getMonitoringSummary: getMonitoringSummary,
    checkAndAddPrecision: checkAndAddPrecision,
    getSellModeData: getSellModeData,
    addPrecisionForMultipleValues: addPrecisionForMultipleValues
  };
};

