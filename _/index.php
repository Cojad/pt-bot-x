<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="ProfitTrailer" content="The one and only ProfitTrailer Monitor">
    <meta name="Elroy" content="Creator and God of ProfitTrailer">
    <meta name="dj_crypto" content="Designer and lover of ProfitTrailer">
    <link rel="shortcut icon" href="images/favicon-32x32.png">
    <title>ProfitTrailer Monitor</title>
    <link href="css/vendor/jquery.circliful.css" rel="stylesheet" type="text/css" />
    <link href="css/vendor/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="css/vendor/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="css/vendor/responsive.bootstrap4.min.css" rel="stylesheet" type="text/css" />
    <link href="css/vendor/switchery.min.css" rel="stylesheet" />
    <link href="css/vendor/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="css/vendor/icons.css" rel="stylesheet" type="text/css">
    <link href="css/vendor/cryptofont.min.css" rel="stylesheet" type="text/css">
    <link href="css/vendor/responsive.dataTables.min.css" rel="stylesheet" type="text/css">
    <link href="css/vendor/toastr.min.css" rel="stylesheet" type="text/css">
    <!-- Versioned files -->
    <link href="css/style.css?ver=4.3.9" rel="stylesheet" type="text/css">
    <link href="css/custom.css?ver=4.3.9" rel="stylesheet" type="text/css">
    <!-- END Versioned files -->
    <script src="js/vendor/jquery.min.js"></script>
    <script src="js/vendor/modernizr.min.js"></script>
</head>
<body class="fixed-left">
    <!-- Begin page -->
    <div id="wrapper">
        <!-- Top Bar Start -->
        <div class="topbar">
            <!-- LOGO -->
            <div class="topbar-left">
                <div class="text-center">
                    <h1 class="main-heading">
                        <a href="/monitoring" class="logo"><img src="images/Logo.png" alt="ProfitTrailer" height="35" width="35"><span class="tdbitcoin">Profit</span><span class="text-primary">Trailer</span></a>
                    </h1>
                </div>
            </div>
            <!-- Button mobile view to collapse sidebar menu -->
            <nav class="navbar-custom">
                <ul class="list-inline float-right mb-0">
                    <li class="list-inline-item notification-list hide-phone">
                        <a class="nav-link waves-light waves-effect" href="#" id="btn-fullscreen" data-toggle="tooltip" data-placement="bottom" title="全螢幕">
                            <i class="fa fa-expand noti-icon text-primary"></i>
                        </a>
                    </li>
                    <div class="dropdown-menu dropdown-menu-right profile-dropdown" aria-labelledby="Preview">
                        <!-- item-->
                        <a href="javascript:void(0);" class="dropdown-item notify-item">
                            <i class="fa fa-unlock"></i>
                        </a>
                    </div>
                </ul>
                <ul class="list-inline float-right mb-0 text-primary">
                    <li class="list-inline-item notification-list spinner text-primary">
                        <i class="fa fa-spinner fa-spin text-primary" aria-hidden="true"></i>
                    </li>
                    <li class="list-inline-item notification-list last-updated-on-container text-primary" id="dvLastUpdatedOn">
                        Updated
                        <time class="time-ago" id="spnTimeAgo"></time>
                    </li>
                </ul>
              <ul class="list-inline menu-left float-left mb-0" data-toggle="tooltip" data-placement="bottom" title="Minimize Sidebar Menu">
                    <li class="float-left">
                        <button class="button-menu-mobile open-left waves-light waves-effect">
                <i class="fa fa-bars text-primary"></i>
            </button>
                    </li>
                </ul>
                <ul class="list-inline mb-0 monitor-summary hide-phone">
                    <li class="list-inline-item tdbitcoin font-16 ticker-text">
                        <label data-toggle="tooltip" data-placement="bottom" title="Balance">餘額</label>: <span id="nBalanceVal">--</span></li>
                    <li class="list-inline-item text-primary font-16 ticker-text">
                        <label data-toggle="tooltip" data-placement="bottom" title="Total Current Value">總值</label>: <span id="nTotalCurrentVal">--</span></li>
                    <li class="list-inline-item text-success font-16 ticker-text">
                        <label data-toggle="tooltip" data-placement="bottom" title="Total Pending Value">潛在總值</label>: <span id="nTotalPendingVal">--</span></li>
                    <li class="list-inline-item text-muted font-16 ticker-text"><label data-toggle="tooltip" data-placement="bottom" title="Profit"><span class="full-text">獲利</span><span class="short-text">P</span></label>:</li>
                    <li class="list-inline-item text-profitlw font-16 ticker-text">
                        <span>(<span id="nLastWeekProfit">-</span> <span data-toggle="tooltip" data-placement="bottom" title="Profit Last Week">週</span>)</span>
                    </li>
                    <li class="list-inline-item text-profityd font-16 ticker-text">
                        <span>(<span id="nYesterdayProfit">-</span> <span data-toggle="tooltip" data-placement="bottom" title="Profit Yesterday">昨</span>)</span>
                    </li>
                    <li class="list-inline-item text-profittd font-16 ticker-text">
                        <span>(<span id="nTodayProfit">-</span> <span data-toggle="tooltip" data-placement="bottom" title="Profit Today">今</span>)</span>
                    </li>
                    <li class="list-inline-item font-16 text-btctrend ticker-text">
                        <label id="nMarketTrendLabel" data-toggle="tooltip" data-placement="bottom" title=""><span class="full-text">趨勢</span><span class="short-text">T</span></label>:
                        <span class="trend-val">(<span id="nMarketTrend">-</span> 24小時) </span>
                    </li>
                    <li class="list-inline-item tdbitcoin font-16 ticker-text">
                        <label id="nMarket" data-toggle="tooltip" data-placement="bottom" title="" >-</label>: <span id="nMarketPrice">-</span>&nbsp;<span id="nMarketPercChange">N/A</span></li>
                </ul>
            </nav>
        </div>
        <!-- Top Bar End -->
        <!-- ========== Left Sidebar Start ========== -->
        <div class="left side-menu">
            <div class="sidebar-inner slimscrollleft">
                <!--- Divider -->
                <div id="sidebar-menu">
                    <ul>
                        <li id="defaultPage"><a href="bot?file=onoff" class="waves-effect waves-primary config"><i class="fa fa-plug"></i><span>開關機</span></a></li>
                        <li class="has_sub" id="configBot" style="display: list-item;">
                          <a href="javascript:void(0);" class="waves-effect waves-primary config"><i class="fa fa-cog"></i><span>設定檔</span>
                          <span class="menu-arrow"></span></a>
                          <ul class="list-unstyled" style="display: none;">
                            <li><a href="config?file=application.properties">程式設定</a></li>
                            <li><a href="config?file=configuration.properties">基本設定</a></li>
                            <li><a href="config?file=trading/PAIRS.properties">Pairs</a></li>
                            <li><a href="config?file=trading/DCA.properties">DCA</a></li>
                            <li><a href="config?file=trading/INDICATORS.properties">Indicators</a></li>
                          </ul>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <!-- Left Sidebar End -->
        <!-- ============================================================== -->
        <!-- Start right Content here -->
        <!-- ============================================================== -->
        <div class="content-page">
            <!-- Start content -->
            <div class="content">
                <div class="container-fluid">
                    <!-- Page-Title -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="page-title-box font-13">
                              <h2 class="page-title tab-heading">Monitoring</h2>
                              <div class="pull-right text-muted">
                                <label data-toggle="tooltip" data-placement="bottom" title="Your Exchange and Coin">Market: </label>
                                <span id="apiExchange">--</span>
                                <span id="apiMarket">--</span>
                                <span class="hide-phone">
                                  <span id="apiSOMContainer">
                                    <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" id="apiSellOnlyModeLabel">SOM: </label>
                                    <span id="apiSellOnlyMode">--</span>
                                  </span>
                                  <label class="m-l-10" data-toggle="tooltip" data-placement="bottom" title="Sell Only Mode Override">SOMO: </label>
                                  <span id="apiSellOnlyModeOverride">--</span>
                                </span>
                                <label class="hide-phone time-hdr" data-toggle="tooltip" data-placement="bottom" title="Current Timezone time">Time:</label>
                                <span id="dvCurrentTime">--</span>
                                <label class="time-hdr hide-phone" data-toggle="tooltip" data-placement="bottom" title="Exchange Server Time / UTC"><span class="full-text">UTC Time:</span><span class="short-text">UTC:</span></label>
                                <span id="dvCurrentUTCTime">--</span>
                              </div>
                              <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
                    <div id="dvPageContent" class="page-content">
                    </div>
                </div>
            </div>
        </div>
        <!-- BOT -->
        <div id="tmplBot" class="hide">
          <div id="configurationContainer" class="row">
						<div class="col-12 configuration-heading-container">
							<button type="button" style="cursor: pointer;color: #ffffff;" class="btn btn-primary btn-sm bot-on"><i class="fa fa-rocket" aria-hidden="true"></i> 啟動</button>&nbsp;&nbsp;&nbsp;
							<button type="button" style="cursor: pointer;color: #ffffff;" class="btn btn-danger btn-sm bot-off"><i class="fa fa-power-off" aria-hidden="true"></i> 停止</button>&nbsp;&nbsp;&nbsp;
                            <button type="button" style="cursor: pointer;color: #ffffff;" class="btn btn-warning btn-sm bot-clear"><i class="fa fa-times" aria-hidden="true"></i> 清除記錄</button>
						</div>
	          <div class="bot-container editor-container col-12" style="">
	          	<iframe id="logIFrame" src="" width="100%" height="100%"></iframe>
	          </div>
          </div>
        </div>
        <!-- end BOT -->
        <!-- SETTINGS -->
        <div id="tmplConfig" class="hide">
          <div id="configurationContainer" class="row">
            <div class="col-12 configuration-heading-container">
              <h3 id="configurationHeading"></h3>
              <span class="show-save-message text-danger">(Unsaved changes)</span>
              <span class="tab-specific-loading">
                <i class="fa fa-spinner fa-spin text-primary" aria-hidden="true"></i>
              </span>
              <div class="pull-right">
                <button type="button " class="btn btn-success btn-sm save-config">
                  <i class="fa fa-floppy-o" aria-hidden="true"></i> Save</button>
              </div>
            </div>
            <div class="editor-container col-12">
              <div class="editor-inner-container">
                  <div id="PBConfigEditor"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- end SETTINGS -->
        <footer class="footer">
          <span class="version-container pull-left font-13 hide-phone">
            <span id="apiDetectedConfigurationChanges">--</span>
          </span>
          <span class="hide-phone">
            <a href="https://profittrailer.io" target="_blank"><span class="full-text">ProfitTrailer.io </span><span class="short-text">2017 © PT.io </span></a> -
            <a href="https://wiki.profittrailer.io" target="_blank"> Wiki</a>
          </span>
          <span class="version-container pull-right font-13" data-toggle="tooltip" data-placement="Top" title="ProfitTrailer Version">
            <label class="m-l-10">
              <span class="tdbitcoin">P</span><span class="text-primary">T</span> Ver: </label>
            <span id="apiVersion">--</span>
          </span>
          <span class="version-container pull-right font-13 hide-phone" data-toggle="tooltip" data-placement="Top" title="Pending Order Time">
            <label>POT: </label>
            <span id="apiPendingOrderTime">--</span>
          </span>
        </footer>
        <!-- ============================================================== -->
        <!-- End Right content here -->
        <!-- ============================================================== -->
        <script>
            var resizefunc = [];
        </script>
        <!-- Plugins  -->
        <script src="js/vendor/popper.min.js"></script>
        <script src="js/vendor/bootstrap.min.js"></script>
        <script src="js/vendor/detect.min.js"></script>
        <script src="js/vendor/fastclick.js"></script>
        <script src="js/vendor/jquery.slimscroll.js"></script>
        <script src="js/vendor/waves.js"></script>
        <script src="js/vendor/jquery.scrollTo.min.js"></script>
        <script src="js/vendor/skycons.min.js"></script>
        <script src="js/vendor/switchery.min.js"></script>
        <script src="js/vendor/jszip.min.js"></script>
        <script src="js/vendor/jquery.dataTables.min.js"></script>
        <script src="js/vendor/dataTables.bootstrap4.min.js"></script>
        <script src="js/vendor/dataTables.buttons.min.js"></script>
        <script src="js/vendor/buttons.bootstrap4.min.js"></script>
        <script src="js/vendor/buttons.html5.min.js"></script>
        <script src="js/vendor/page.js"></script>
        <script src="js/vendor/jquery.app.js"></script>
        <script src="js/vendor/datatable-responsive.min.js"></script>
        <script src="js/vendor/jquery.timeago.js"></script>
        <script src="js/vendor/toastr.min.js"></script>
        <script src="js/vendor/jquery.core.js"></script>
        <script src="js/vendor/ace/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/ace/src-noconflict/theme-twilight.js" type="text/javascript" charset="utf-8"></script>
        <script src="js/vendor/ace/src-noconflict/mode-properties.js" type="text/javascript" charset="utf-8"></script>
        <!-- Versioned files -->
        <script src="js/constants.js?ver=4.3.9"></script>
        <script src="js/helpers/dateTimeHelper.js?ver=4.3.9"></script>
        <script src="js/helpers/domHelper.js?ver=4.3.9"></script>
        <script src="js/helpers/dataTableHelper.js?ver=4.3.9"></script>
        <script src="js/tableDefs.js?ver=4.3.9"></script>
        <script src="js/helpers/routeHelper.js?ver=4.3.9"></script>
        <script src="js/services.js?ver=4.3.9"></script>
        <script src="js/script.js?ver=4.3.9"></script>
        <!-- END Versioned files -->
    </div>

    <!-- ProfitTrailer Version: 4.3.9 -->
</body>
</html>
