function getTableRefs ($) {
  var tables = {
    dtSellLogs: null,
    dtPossibleBuys: null,
    dtDcaLogs: null,
    dtPairsLogs: null,
    dtPendingLogs: null,
    dtDustLogs: null
  };

  function destroyTable () {
    for (var table in tables) {
      if (!tables[table]) {
        continue;
      }
      // destroy the table.
      if (tables[table].destroy) {
        tables[table].destroy(true);
        tables[table] = null;
      }
    }
  }

  /**
   * Called to render the sell log datatable.
   * @param {any} sellLogData
   * @returns
   */
  function loadSellLogData (sellLogData) {
    if (tables.dtSellLogs) {
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtSellLogs, sellLogData);
      return colTotals(tables.dtSellLogs, {
        boughtCost: 10,
        soldValue: 11
      });
    }
    // Initialize the table.
    // We have to give below classes to show in that particular resolution
    // Classes:
    // not-mobile : Only in Tablets and desktop
    // min-tablet-l: Only in landscape tablet and desktop
    // min-tablet-p: Only in portrait tablet and desktop
    // tablet: Only in tablet
    // desktop: Only in desktop
    // all: In all the resolutions, takes precedence over other classes
    // mobile-l : Only in landscape mobiles

    // Reference: https://datatables.net/extensions/responsive/classes#Logic-reference
    // Note : Responsiveness will not work if we want to show more columns than window width
    // Landscape(l) and Portrait(p) applies to tablet, mobile and desktop
    var $salesLogDataTable = $('#dtSalesLog');
    tables.dtSellLogs = $salesLogDataTable.DataTable(DataTableHelper.getDataTableStructure({
      data: sellLogData,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'all']],
      pageLength: 25,
      searching: true,
      order: [[1, 'desc']],
      paging: true,
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'copy',
          className: 'btn btn-dark'
        },
        {
          extend: 'excel',
          className: 'btn btn-dark',
          title: 'sales-log'
        }],
      language: {
        buttons: {
          copyTitle: 'Sales Log',
        }
      },
      className: 'btn btn-dark',
      columns: [{
        title: '#',
        // disable ordering on this column.
        orderable: false,
        data: function () {
          // will be later updated by the index value
          return '-';
        },
        className: 'index all'
      }, {
        title: 'Date',
        data: DataTableHelper.dateHandler('soldDate'),
        tooltip: 'Date (Time Since)',
        className: 'date all'
      }, {
        title: 'Coin',
        data: 'market',
        tooltip: 'Coin Pair',
        className: 'market all',
        render: DataTableHelper.renderMarketCol
      }, {
        title: 'Sell Strat',
        data: 'sellStrategy',
        tooltip: 'Sell Strategy',
        className: 'sell-strategy'
      }, {
        title: 'Bought Price',
        data: DataTableHelper.handleAvgPriceBoughtTimes,
        tooltip: 'Bought Price',
        className: 'text-right bought-price all'
      }, {
        title: 'Sold Price',
        data: 'currentPrice',
        tooltip: 'Sold Price',
        className: 'text-right sold-price all',
        render: DataTableHelper.addPrecision
      }, {
        title: 'Profit%',
        data: 'profit',
        tooltip: 'Profit in %',
        className: 'text-right profit all',
        /**
         * Display only the last 2 digits
         * https://datatables.net/reference/option/columns.render
         */
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfit
      }, {
        title: 'Trigger%',
        data: 'triggerValue',
        tooltip: 'Trigger',
        // Will be visible only on landscape tablet and desktop
        className: 'text-right trigger all',
        render: DataTableHelper.handleMoney
      }, {
        title: 'Profit <span class="api-market"> </span>',
        data: DataTableHelper.getProfitBTCForSalesLog,
        tooltip: 'Profit in your Market and USD ',
        className: 'text-right profit-btc all'
      }, {
        title: 'Sold Amount',
        data: 'soldAmount',
        tooltip: 'Sold Amount',
        // Will be visible in all the resolutions (all class will take precedence over other classes)
        className: 'text-right sold-amount',
        render: DataTableHelper.addPrecision
      }, {
        title: 'Bought Cost',
        data: DataTableHelper.handleTotalCstFrSalesLog,
        tooltip: 'Bought Cost',
        // Will be visible in all the resolutions (all class will take precedence over over other classes)
        className: 'text-right bought-cost'
      }, {
        title: 'Sold Value',
        data: DataTableHelper.getCurrentValueForSalesLog,
        tooltip: 'Sold Value',
        // Will be visible only on table and desktop
        className: 'text-right sold-value all'
      }],
      initComplete: function () {
        jQuery(document).trigger('evt.add-market-value');
      }
    }));
    addTooltips(tables.dtSellLogs, $salesLogDataTable);
    // Used to generate the index column.
    DataTableHelper.setIndex(tables.dtSellLogs);
    return colTotals(tables.dtSellLogs, {
      boughtCost: 10,
      soldValue: 11
    });

  }

  /**
   * It adds tooltip for datatable headers.
   * @param {*} dataTable 
   * @param {*}  $table
   */
  function addTooltips (dataTable, $table) {
    dataTable.columns().iterator('column', function (settings, column) {
      if (settings.aoColumns[column].tooltip !== undefined) {
        $(dataTable.column(column).header()).attr('title', settings.aoColumns[column].tooltip);
      }
    });
    $table.find('th').tooltip('dispose').tooltip({
      placement: 'bottom'
    });
  }

  function cbUpdateDtCache (data) {
    const cache = {
      marketingSite: data.exchangeUrl,
      timeZoneOffset: data.timeZoneOffset,
      market: data.market,
      marketPrice: data[data.market + 'USDTPrice'] ? data[data.market + 'USDTPrice'] : 0
    };
    DataTableHelper.setDataCache(cache);
  }

  /**
   * Called to render the possible buys datatable
   * @param {any} possibleBuyData
   */
  function loadPossibleBuyData (possibleBuyData) {
    if (tables.dtPossibleBuys) {
      // table is already initialized, just rebind the data.
      return DataTableHelper.reBindData(tables.dtPossibleBuys, possibleBuyData);
    }
    var $possibleLogDataTable = $('#dtPossibleBuysLog');

    // initialize the table.
    tables.dtPossibleBuys = $possibleLogDataTable.DataTable(DataTableHelper.getDataTableStructure({
      order: [[5, 'desc']],
      data: possibleBuyData,
      buttons: [
        {
          extend: 'copy',
          className: 'btn btn-dark'
        },
        {
          extend: 'excel',
          className: 'btn btn-dark',
          title: 'possible-buy-log'
        }],
      language: {
        buttons: {
          copyTitle: 'Possible Buy Log',
        }
      },
      columns: [{
        title: '#',
        orderable: false,
        data: function () {
          return '-';
        },
        className: 'index all'
      }, {
        title: 'Coin',
        data: 'market',
        tooltip: 'Coin Pair',
        className: 'market all',
        render: DataTableHelper.renderMarketCol
      }, {
        title: '24H%',
        data: DataTableHelper.renderPercentageChange,
        tooltip: '24 Hour % Change',
        className: 'text-right percentage all',
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'Buy Strat',
        data: 'buyStrategy',
        tooltip: 'Buy Strategy',
        className: 'buy-strategy all',
        render: DataTableHelper.renderBuyStrategy
      }, {
        title: 'Current Price',
        data: 'currentPrice',
        tooltip: 'Current Price',
        className: 'text-right blue-color current-price all',
        render: DataTableHelper.addPrecision
      }, {
        title: 'VOL',
        data: 'volume',
        tooltip: 'Volume',
        className: 'text-right volume',
        render: DataTableHelper.renderVolume
      }, {
        title: 'Current BB',
        data: DataTableHelper.handleCurrentBB,
        tooltip: 'Current Bollinger Band',
        className: 'text-right current-bb all'
      }, {
        title: 'BB Trigger',
        data: 'BBTrigger',
        tooltip: 'Bollinger Band Trigger',
        className: 'text-right trigger all',
        render: DataTableHelper.addPrecision
      }, {
        title: 'Current Value',
        data: 'currentValue',
        tooltip: 'Current Value',
        className: 'text-right blue-color current-value all',
        render: DataTableHelper.handleMoney
      }, {
        title: 'Buy Value',
        data: 'triggerValue',
        tooltip: 'Buy Value',
        className: 'text-right buy-value all',
        render: DataTableHelper.handleMoney
      }]
    }));
    addTooltips(tables.dtPossibleBuys, $possibleLogDataTable);
    // Used to generate the index column.
    DataTableHelper.setIndex(tables.dtPossibleBuys);
  }

  function loadPendingLogsData (pendingLogsData) {
    if (tables.dtPendingLogs) {
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtPendingLogs, pendingLogsData);
      return colTotals(tables.dtPendingLogs, {
        currentValue: 8,
        totalCost: 9
      });
    }
    // initialize the table.
    var $dtPendingLogs = $('#dtPendingLogs');
    tables.dtPendingLogs = $dtPendingLogs.DataTable(DataTableHelper.getDataTableStructure({
      data: pendingLogsData,
      order: [[6, 'desc']],
      buttons: [
        {
          extend: 'copy',
          className: 'btn btn-dark'
        },
        {
          extend: 'excel',
          className: 'btn btn-dark',
          title: 'pending-log'
        }],
      language: {
        buttons: {
          copyTitle: 'Pending Log',
        }
      },
      columns: [{
        title: 'Coin',
        data: 'market',
        tooltip: 'Coin Pair',
        className: 'market all',
        render: DataTableHelper.renderMarketCol
      }, {
        title: '24H%',
        data: DataTableHelper.renderPercentageChange,
        tooltip: '24 Hour % Change',
        className: 'text-right percentage all',
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'Sell Strat',
        data: 'sellStrategy',
        tooltip: 'Sell Strategy',
        className: 'sell-strategy all'
      }, {
        title: 'Current Price <br> Target Price',
        data: DataTableHelper.handleAvgValAndCurrentPrice,
        tooltip: 'Current Price',
        className: 'text-right target-price all'
      }, {
        title: 'Profit%',
        data: 'profit',
        tooltip: 'Profit in %',
        className: 'text-right profit all',
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfit
      }, {
        title: 'Comb Profit%',
        data: 'combinedProfit',
        tooltip: 'Combined Profit in %',
        className: 'text-right profit all',
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'Trigger%',
        data: 'triggerValue',
        tooltip: 'Trigger Value in %',
        className: 'text-right trigger all',
        render: DataTableHelper.handleMoney
      }, {
        title: 'Total Amount',
        data: DataTableHelper.handleTotalAmnt,
        tooltip: 'Total Amount',
        className: 'text-right total-amount'
      }, {
        title: 'Current Value <br> Target Value',
        data: DataTableHelper.getCurrentValAndTotalCost,
        tooltip: 'Current Value',
        className: 'text-right blue-color current-value all'
      }, {
        title: 'Target Value',
        data: DataTableHelper.handleTotalCst,
        tooltip: 'Target Value',
        className: 'text-right target-value all hide'
      }]
    }));
    addTooltips(tables.dtPendingLogs, $dtPendingLogs);
    return colTotals(tables.dtPendingLogs, {
      currentValue: 8,
      totalCost: 9
    });
  }

  function loadDcaLogsData (dcaLogData) {
    if (tables.dtDcaLogs) {
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtDcaLogs, dcaLogData);
      return colTotals(tables.dtDcaLogs, {
        currentValue: 12,
        totalCost: 13
      });
    }
    // initialize the table.
    var $dtDcaLogs = $('#dtDcaLogs');
    tables.dtDcaLogs = $dtDcaLogs.DataTable(DataTableHelper.getDataTableStructure({
      data: dcaLogData,
      order: [[8, 'desc']],
      buttons: [
        {
          extend: 'copy',
          className: 'btn btn-dark'
        },
        {
          extend: 'excel',
          className: 'btn btn-dark',
          title: 'dca-log'
        }],
      language: {
        buttons: {
          copyTitle: 'DCA Log',
        }
      },
      columns: [{
        title: 'Date',
        data: DataTableHelper.dateHandler('firstBoughtDate', 'averageCalculator'),
        tooltip: 'Date (Time Since)',
        className: 'date all'
      }, {
        title: 'Coin',
        data: 'market',
        tooltip: 'Coin Pair',
        className: 'market all',
        render: DataTableHelper.renderMarketCol
      }, {
        title: '24H%',
        data: DataTableHelper.renderPercentageChange,
        tooltip: '24 Hour % Change',
        className: 'text-right percentage all',
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'Buy Strat',
        data: 'buyStrategy',
        tooltip: 'Buy Strategy',
        className: 'buy-strategy all',
        render: DataTableHelper.renderBuyStrategy
      }, {
        title: 'BT%',
        data: 'buyProfit',
        tooltip: 'Buy Trigger',
        className: 'text-right buy-profit all',
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'BB / Trigger',
        data: DataTableHelper.renderBBTrigger,
        tooltip: 'Bollinger Band / Trigger',
        className: 'text-right bbtrigger all'
      }, {
        title: 'Sell Strat',
        data: 'sellStrategy',
        tooltip: 'Sell Strategy',
        className: 'sell-strategy'
      }, {
        title: 'Current Price<br>Average Price',
        data: DataTableHelper.handleAvgPriceDcaLog,
        tooltip: 'Current Price',
        className: 'text-right blue-color avg-price current-price all'
      }, {
        title: 'Profit%',
        data: 'profit',
        tooltip: 'Profit in %',
        className: 'text-right profit all',
        /**
         * Display only the last 2 digits
         * https://datatables.net/reference/option/columns.render
         */
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfit
      }, {
        title: 'ST%',
        data: 'triggerValue',
        tooltip: 'Sell Trigger',
        render: DataTableHelper.handleMoney,
        className: 'text-right trigger all'
      }, {
        title: 'VOL',
        data: 'volume',
        tooltip: 'Volume',
        className: 'text-right volume all',
        render: DataTableHelper.renderVolume
      }, {
        title: 'Total Amount',
        data: DataTableHelper.handleTotalAmnt,
        tooltip: 'Total Amount',
        className: 'text-right total-amount'
      }, {
        title: 'Current Value<br>Total Cost',
        data: DataTableHelper.getCurrentValAndTotalCost,
        tooltip: 'Current Value',
        className: 'text-right blue-color current-value'
      }, {
        title: 'Total Cost',
        data: DataTableHelper.handleTotalCst,
        tooltip: 'Total Cost',
        className: 'text-right total-cost hide'
      }]
    }));

    addTooltips(tables.dtDcaLogs, $dtDcaLogs);

    // 12, 13
    return colTotals(tables.dtDcaLogs, {
      currentValue: 12,
      totalCost: 13
    });
  }

  function loadDustLogsData (gainLogData, watchModeLogData) {
    var finalData = gainLogData;
    if (Array.isArray(watchModeLogData)) {
      finalData = gainLogData.concat(watchModeLogData);
    }
    if (tables.dtDustLogs) {
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtDustLogs, finalData);
      return colTotals(tables.dtDustLogs, {
        currentValue: 10,
        totalCost: 11
      });
    }
    // initialize the table.
    var $dtDustLogs = $('#dtDustLogs');
    tables.dtDustLogs = $dtDustLogs.DataTable(DataTableHelper.getDataTableStructure({
      data: finalData,
      order: [[6, 'desc']],
      buttons: [
        {
          extend: 'copy',
          className: 'btn btn-dark'
        },
        {
          extend: 'excel',
          className: 'btn btn-dark',
          title: 'dust-log'
        }],
      language: {
        buttons: {
          copyTitle: 'Dust Log',
        }
      },
      columns: [{
        title: 'Date',
        data: DataTableHelper.dateHandler('firstBoughtDate', 'averageCalculator'),
        tooltip: 'Date (Time Since)',
        className: 'date all'
      }, {
        title: 'Coin',
        data: 'market',
        tooltip: 'Coin Pair',
        className: 'market all',
        render: DataTableHelper.renderMarketCol
      }, {
        title: '24H%',
        data: DataTableHelper.renderPercentageChange,
        tooltip: '24 Hour % Change',
        className: 'text-right percentage all',
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'Sell Strat',
        data: 'sellStrategy',
        tooltip: 'Sell Strategy',
        className: 'sell-strategy'
      }, {
        title: 'Current Price',
        data: 'currentPrice',
        tooltip: 'Current Price',
        className: 'text-right blue-color current-price all',
        render: DataTableHelper.addPrecision
      }, {
        title: 'Bought Price',
        data: DataTableHelper.handleAvgPrice,
        tooltip: 'Bought Price',
        className: 'text-right bought-price all'
      }, {
        title: 'Profit%',
        data: 'profit',
        tooltip: 'Profit in %',
        className: 'text-right profit all',
        /**
         * Display only the last 2 digits
         * https://datatables.net/reference/option/columns.render
         */
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfit
      }, {
        title: 'Trigger%',
        data: 'triggerValue',
        tooltip: 'Trigger in %',
        render: DataTableHelper.handleMoney,
        className: 'text-right trigger all'
      }, {
        title: 'VOL',
        data: 'volume',
        tooltip: 'Volume',
        className: 'text-right volume',
        render: DataTableHelper.renderVolume
      }, {
        title: 'Total Amount',
        data: DataTableHelper.handleTotalAmnt,
        tooltip: 'Total Amount',
        className: 'text-right total-amount'
      }, {
        title: 'Current Value',
        data: DataTableHelper.getCurrentValue,
        tooltip: 'Current Value',
        className: 'text-right blue-color current-value all'
      }, {
        title: 'Bought Cost',
        data: DataTableHelper.handleTotalCst,
        tooltip: 'Bought Cost',
        className: 'text-right bought-cost all'
      }]
    }));

    addTooltips(tables.dtDustLogs, $dtDustLogs);

    // 10, 11
    return colTotals(tables.dtDustLogs, {
      currentValue: 10,
      totalCost: 11
    });
  }

  function loadPairLogsData (gainLogData, watchModeLogData) {
    var finalData = gainLogData;
    if (Array.isArray(watchModeLogData)) {
      finalData = gainLogData.concat(watchModeLogData);
    }
    if (tables.dtPairsLogs) {
      // table is already initialized, just rebind the data.
      DataTableHelper.reBindData(tables.dtPairsLogs, finalData);
      return colTotals(tables.dtPairsLogs, {
        currentValue: 10,
        totalCost: 11
      });
    }
    var $dtPairsLogs = $('#dtPairsLogs');
    // initialize the table.
    tables.dtPairsLogs = $dtPairsLogs.DataTable(DataTableHelper.getDataTableStructure({
      data: finalData,
      order: [[6, 'desc']],
      buttons: [
        {
          extend: 'copy',
          className: 'btn btn-dark'
        },
        {
          extend: 'excel',
          className: 'btn btn-dark',
          title: 'pairs-log'
        }],
      language: {
        buttons: {
          copyTitle: 'Pairs Log',
        }
      },
      columns: [{
        title: 'Date',
        data: DataTableHelper.dateHandler('firstBoughtDate', 'averageCalculator'),
        tooltip: 'Date (Time Since)',
        className: 'date all'
      }, {
        title: 'Coin',
        data: 'market',
        tooltip: 'Coin Pair',
        className: 'market all',
        render: DataTableHelper.renderMarketCol
      }, {
        title: '24H%',
        data: DataTableHelper.renderPercentageChange,
        tooltip: '24 Hour % Change',
        className: 'text-right percentage all',
        createdCell: DataTableHelper.handleProfitText
      }, {
        title: 'Sell Strat',
        data: 'sellStrategy',
        tooltip: 'Sell Strategy',
        className: 'sell-strategy'
      }, {
        title: 'Current Price',
        data: 'currentPrice',
        tooltip: 'Current Price',
        className: 'text-right blue-color current-price all',
        render: DataTableHelper.addPrecision
      }, {
        title: 'Bought Price',
        data: DataTableHelper.handleAvgPrice,
        tooltip: 'Bought Price',
        className: 'text-right bought-price all'
      }, {
        title: 'Profit%',
        data: 'profit',
        tooltip: 'Profit in %',
        className: 'text-right profit all',
        /**
         * Display only the last 2 digits
         * https://datatables.net/reference/option/columns.render
         */
        render: DataTableHelper.handleMoney,
        createdCell: DataTableHelper.handleProfit
      }, {
        title: 'Trigger%',
        data: 'triggerValue',
        tooltip: 'Trigger',
        render: DataTableHelper.handleMoney,
        className: 'text-right trigger all'
      }, {
        title: 'VOL',
        data: 'volume',
        tooltip: 'Volume',
        className: 'text-right volume',
        render: DataTableHelper.renderVolume
      }, {
        title: 'Total Amount',
        data: DataTableHelper.handleTotalAmnt,
        tooltip: 'Total Amount',
        className: 'text-right total-amount'
      }, {
        title: 'Current Value',
        data: DataTableHelper.getCurrentValue,
        tooltip: 'Current Value',
        className: 'text-right blue-color current-value all'
      }, {
        title: 'Bought Cost',
        data: DataTableHelper.handleTotalCst,
        tooltip: 'Bought Cost',
        className: 'text-right bought-cost all'
      }]
    }));
    addTooltips(tables.dtPairsLogs, $dtPairsLogs);

    // 10, 11
    return colTotals(tables.dtPairsLogs, {
      currentValue: 10,
      totalCost: 11
    });
  }

  function colTotals (table, dataset) {
    var response = {};
    for (var data in dataset) {
      var colNum = +dataset[data];
      if (isNaN(colNum)) {
        response[data] = 0;
        continue;
      }
      response[data] = table.column(colNum).data().sum();
    }

    return response;
  }

  // https://datatables.net/plug-ins/api/sum()
  jQuery.fn.dataTable.Api.register('sum()', function () {
    return this.flatten().reduce(function (a, b) {
      return a + b;
    }, 0);
  });

  return {
    destroyTable: destroyTable,
    loadPairLogsData: loadPairLogsData,
    loadDustLogsData: loadDustLogsData,
    loadDcaLogsData: loadDcaLogsData,
    loadPendingLogsData: loadPendingLogsData,
    loadPossibleBuyData: loadPossibleBuyData,
    loadSellLogData: loadSellLogData,
    cbUpdateDtCache: cbUpdateDtCache
  };
}
