const DataTableHelper = (function () {

  // A cache for data that has a global impact on rendered columns
  // but changes whenever an AJAX call is made. For example - Marketing Site.
  var dtCache = {};

  function dateHandler (propName, parentProperty) {
    // return the actual render function
    return function (row, type) {
      var colData = parentProperty ? row[parentProperty][propName] : row[propName];
      var dt = DateTimeHelper.getDateObj(colData, dtCache.timeZoneOffset);
      if (!dt) {
        return '--';
      }
      if (type === 'set') {
        return dt.getTime();
      } else if (type === 'display') {
        var diffDays = getDaysDifferenceFromToday(dt);
        var dateAndDaysDiff = DateTimeHelper.formatDate(dt) + ' (' + diffDays + 'D)';
        return dateAndDaysDiff;
      } else if (type === 'filter') {
        return DateTimeHelper.formatDate(dt);
      }
      // 'sort', 'type' and undefined all just use the integer
      return dt.getTime();
    };
  }

  function getDaysDifferenceFromToday (date) {
    var currentDate = DateTimeHelper.getUTCDateWithOffset(dtCache.timeZoneOffset);
    var timeDiff = date.getTime() - currentDate.getTime();
    var diffDaysTmp = timeDiff / (1000 * 3600 * 24);
    var diffDays = diffDaysTmp < 0 ? Math.ceil(diffDaysTmp) : Math.floor(diffDaysTmp);
    return diffDays;
  }

  function handleProfit (td, cellData) {
    // To add custom formatting to the cell based on the value.
    // https://datatables.net/reference/option/columns.createdCell
    if (cellData < PBConstants.PROFIT_GREEN) {
      $(td).addClass('loss-class').removeClass('profit-class');
    } else {
      $(td).addClass('profit-class').removeClass('loss-class');
    }
  }

  function handleProfitText (td, cellData) {
    // To add custom formatting to the cell based on the value.
    // https://datatables.net/reference/option/columns.createdCell
    if (cellData < PBConstants.PROFIT_GREEN) {
      $(td).addClass('loss-classtext').removeClass('profit-classtext');
    } else {
      $(td).addClass('profit-classtext').removeClass('loss-classtext');
    }
  }

  function renderMarketCol (data, type) {
    if (type === 'display') {
      return '<a href="' + dtCache.marketingSite + data + '" target="_blank">' + data + '</a>';
    }
    return data;
  }

  function handleMoney (data, type) {
    if (type === 'display') {
      return data.toFixed(2);
    }
    return data;
  }

  function setIndex (dtApi) {
    dtApi.on('order.dt', function () {
      dtApi.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
      });
    }).draw();
  }

  function addPrecision (data, type) {
    return checkAndAddPrecision(data, type);
  }

  function getDataTableStructure (dtCustom) {
    return jQuery.extend(true, {
      paging: false,
      dom: 'Bfrtip',
      responsive: true,
      stateSave: true,
      language: {
        // changes the total records text shown at the bottom.
        info: 'Total records: _MAX_',
        infoEmpty: 'Total records: 0',
        emptyTable: 'No records found.'
      },
      searching: false
    }, dtCustom);
  }

  function reBindData (table, data) {
    // if data is undefined, set it to an empty array
    // so that datatable doesn't crash.
    if (!data) {
      data = [];
    }
    table.clear().rows.add(data);
    table.draw();
  }

  function getCurrentValue (data, type) {
    var currentValue = data.averageCalculator.totalAmount * data.currentPrice;
    var nrmlsdCurrentValue = getCurrentValueBsdOnfee(data, currentValue);
    return checkAndAddPrecision(nrmlsdCurrentValue, type);
  }

  function getCurrentValueBsdOnfee (data, currentValue) {
    var fee = data.averageCalculator.fee;
    currentValue = currentValue * (1 - (fee / 100));

    return currentValue;
  }

  function checkAndAddPrecision (data, type, precision) {
    if (type === 'display' || type === 'sales' || type === 'filter') {
      var precisionTmp = precision ? precision : PBConstants.DEFAULT_PRECISION;
      return data.toFixed(precisionTmp);
    }
    return data;
  }

  function renderPercentageChange (data) {
    var percChange = data.percChange * 100;
    return percChange.toFixed(2);
  }

  function handleTotalAmnt (data, type) {
    return checkAndAddPrecision(data.averageCalculator.totalAmount, type);
  }

  function handleTotalCst (data, type) {
    return checkAndAddPrecision(data.averageCalculator.totalCost, type);
  }

  function handleTotalCstFrSalesLog (data, type) {
    var totalCost = data.soldAmount * data.averageCalculator.avgPrice;
    return checkAndAddPrecision(totalCost, type);
  }

  function getCurrentValueForSalesLog (data, type) {
    var currentValue = data.soldAmount * data.currentPrice;
    var nrmlsdCurrentValue = getCurrentValueBsdOnfee(data, currentValue);
    return checkAndAddPrecision(nrmlsdCurrentValue, type);
  }

  /**
   * It will return "BBLow" or "BBHigh" that has a value.
   * It will return zero if both have zero value.
   */
  function handleCurrentBB (data, type) {
    var currentBB = data.BBLow ? data.BBLow : data.BBHigh;
    return checkAndAddPrecision(currentBB, type);
  }

  function handleAvgPrice (data, type) {
    return checkAndAddPrecision(data.averageCalculator.avgPrice, type);
  }

  function handleAvgPriceDcaLog (data, type) {
    if (type === 'display') {
      var currentPrice = checkAndAddPrecision(data.currentPrice, type);
      var avgPrice = checkAndAddPrecision(data.averageCalculator.avgPrice, type);
      return '<span class="dca-avg-current-price">' + currentPrice + '<span class="dca-bought-times invisible">(' +
        data.boughtTimes + ')</span>' + '</br>' + avgPrice + '<span class="dca-bought-times">(' + data.boughtTimes + ')</span></span>';
    } else if (type === 'sort') {
      return data.boughtTimes;
    }
    return data.averageCalculator.avgPrice;
  }

  function renderBBTrigger (row) {
    var BBTotal = row.BBLow ? row.BBLow : row.highbb;
    var BBTrigger = row.BBTrigger.toFixed(PBConstants.DEFAULT_PRECISION);
    return BBTotal.toFixed(PBConstants.DEFAULT_PRECISION) + '</br>' + BBTrigger;
  }

  function getProfitBTC (row, type) {
    return checkAndAddPrecision(getCurrentValue(row, '') - row.averageCalculator.totalCost, type);
  }

  function getProfitBTCForSalesLog (row, type) {
    var profitValue = checkAndAddPrecision(getCurrentValueForSalesLog(row, '') - handleTotalCstFrSalesLog(row, ''), type);
    if (type === 'display' || type === 'filter') {
      var profitClass = +profitValue < PBConstants.PROFIT_GREEN ? 'loss-classtext' : 'profit-classtext';
      var profitString = '<span class="' + profitClass + '">' + profitValue + '</span>';

      // If market is USDT then don't show the market profit value.
      if (dtCache.market !== PBConstants.HIDE_PROFIT_MARKET_AND_ESTIMATED_USD) {
        var currentTrendProfit = checkAndAddPrecision((getCurrentValueForSalesLog(row, '') + dtCache.marketPrice * profitValue), type, 2);
        var currentTrendProfitClass = +currentTrendProfit < PBConstants.PROFIT_GREEN ? 'loss-classtext' : 'profit-classtext';
        profitString += '<span class="sales-market-profit ' + currentTrendProfitClass + '"> ($' + currentTrendProfit + ')<span>';
      }
      return profitString;
    }
    return profitValue;
  }

  function renderBuyStrategy (data, type, row) {
    var positiveCls = '';
    if (row.positive && row.positive !== 'false') {
      positiveCls = PBConstants.POSITIVE_CLASS;
    } else {
      positiveCls = PBConstants.NEGATIVE_CLASS;
    }
    return data + ' - <span class="' + positiveCls + '">(' + row.positive.toString() + ')</span>';
  }

  function renderVolume (data) {
    return Math.round(data);
  }

  function handleAvgPriceBoughtTimes (data, type) {
    if (type === 'display') {
      var avgPriceBroughtTimes = checkAndAddPrecision(data.averageCalculator.avgPrice, type);
      // Don't show bought times if it is zero
      if (+data.boughtTimes !== 0) {
        avgPriceBroughtTimes += '<span>(' + data.boughtTimes + ')</span>';
      } else {
        avgPriceBroughtTimes += '<span class="hide">(' + data.boughtTimes + ')</span>';
      }
      return avgPriceBroughtTimes;
    }
    return data.averageCalculator.avgPrice;
  }

  function getCurrentValAndTotalCost (data, type, row) {
    var currentValue = getCurrentValue(data, type, row);
    if (type === 'display') {
      var totalCost = handleTotalCst(data, type, row);
      return currentValue + '<br>' + totalCost;
    } else {
      return currentValue;
    }
  }

  function handleAvgValAndCurrentPrice (data, type, row) {
    var avgPrice = handleAvgPrice(data, type, row);
    if (type === 'display') {
      var currentPrice = data.currentPrice.toFixed(PBConstants.DEFAULT_PRECISION);
      return currentPrice + '<br>' + avgPrice;
    } else {
      return avgPrice;
    }
  }

  function setDataCache (cache) {
    if (cache) {
      dtCache = cache;
    }
  }

  // public methods
  return {
    dateHandler: dateHandler,
    renderMarketCol: renderMarketCol,
    handleMoney: handleMoney,
    setIndex: setIndex,
    getDataTableStructure: getDataTableStructure,
    getCurrentValue: getCurrentValue,
    renderBuyStrategy: renderBuyStrategy,
    renderVolume: renderVolume,
    addPrecision: addPrecision,
    handleProfit: handleProfit,
    handleProfitText: handleProfitText,
    reBindData: reBindData,
    getProfitBTC: getProfitBTC,
    getProfitBTCForSalesLog: getProfitBTCForSalesLog,
    renderBBTrigger: renderBBTrigger,
    handleAvgPrice: handleAvgPrice,
    handleTotalAmnt: handleTotalAmnt,
    handleTotalCst: handleTotalCst,
    handleCurrentBB: handleCurrentBB,
    renderPercentageChange: renderPercentageChange,
    handleTotalCstFrSalesLog: handleTotalCstFrSalesLog,
    handleAvgPriceDcaLog: handleAvgPriceDcaLog,
    handleAvgPriceBoughtTimes: handleAvgPriceBoughtTimes,
    getCurrentValueForSalesLog: getCurrentValueForSalesLog,
    setDataCache: setDataCache,
    getCurrentValAndTotalCost: getCurrentValAndTotalCost,
    handleAvgValAndCurrentPrice: handleAvgValAndCurrentPrice,
    getCurrentValueBsdOnfee: getCurrentValueBsdOnfee,
  };
}());
