<?php
/*
 * /monitoring 語系檔案
 *
*/
function lang_monitoring($in){
$s[]='<i class="fa fa-wrench"></i><span> Config</span>';
$r[]='<i class="fa fa-wrench"></i><span>設定</span>';
$s[]='<li><a href="config?file=configuration.properties">Configuration</a></li>';
$r[]='<li><a href="config?file=configuration.properties">基本設定</a></li>';
$s[]='<li><a href="config?file=application.properties">Application Setting</a></li>';
$r[]='<li><a href="config?file=application.properties">程式設定</a></li>';
$s[]='</i><span> Monitoring </span>';
$r[]='</i><span>主控台</span>';
$s[]='><i class="fa fa-optin-monster"></i><span> Possible Buy Log </span>';
$r[]='title="Possible Buy Log"><i class="fa fa-optin-monster"></i><span>潛在購買紀錄</span>';
$s[]='><i class="fa fa-houzz"></i><span> Pairs Log </span>';
$r[]='title="Pairs Log"><i class="fa fa-houzz"></i><span>下單記錄</span>';
$s[]='><i class="fa fa-hand-peace-o"></i><span> DCA Log </span>';
$r[]='title="DCA Log"><i class="fa fa-hand-peace-o"></i><span>往下攤平記錄</span>';
$s[]='><i class="fa fa-gg"></i><span> Pending Log </span>';
$r[]='title="Pending Log"><i class="fa fa-gg"></i><span>待賣出記錄</span>';
$s[]='><i class="fa fa-balance-scale"></i><span> Sales Log </span>';
$r[]='title="Sales Log"><i class="fa fa-balance-scale"></i><span>賣出記錄</span>';
$s[]='><i class="fa fa-recycle"></i><span> Dust Log </span>';
$r[]='title="Dust Log"><i class="fa fa-recycle"></i><span>塵埃記錄(Dust)</span>';
$s[]='title="Balance">BAL</label>';
$r[]='title="Balance">餘額</label>';
$s[]='title="Total Current Value">TCV</label>';
$r[]='title="Total Current Value">總值</label>';
$s[]='title="Total Pending Value">TPV</label>';
$r[]='title="Total Pending Value">潛在總值</label>';
$s[]='class="full-text">Profit</span>';
$r[]='class="full-text">獲利</span>';
$s[]='class="short-text">P</span></label>:</li>';
$r[]='class="short-text">P</span></label>:</li>';
$s[]='title="Profit Last Week">LW</span>';
$r[]='title="Profit Last Week">週</span>';
$s[]='title="Profit Yesterday">YD</span>';
$r[]='title="Profit Yesterday">昨</span>';
$s[]='title="Profit Today">TD</span>';
$r[]='title="Profit Today">今</span>';
$s[]='class="full-text">Trend</span>';
$r[]='class="full-text">趨勢</span>';
$s[]='class="short-text">T</span>';
$r[]='class="short-text">T</span>';
$s[]='</span> 24H) </span>';
$r[]='</span> 24小時) </span>';
$s[]='title="Fullscreen">';
$r[]='title="全螢幕">';
$s[]='Est. USD Value</span>';
$r[]='約值 USD</span>';
$s[]='Estimated USD Value</span>';
$r[]='估計價值 USD</span>';
$s[]='main-text">Balance</p>';
$r[]='main-text">餘額</p>';
$s[]='main-text">Total Current Value</p>';
$r[]='main-text">總價值</p>';
$s[]='main-text">Total Pending Value</p>';
$r[]='main-text">潛在總值</p>';
$s[]='title="BTC trend last 24h"';
$r[]='title="BTC 24小時趨勢"';
$s[]='Last BTCUSD price from your Market';
$r[]='來自您交易所的最新的美元匯率';
$s[]='main-text">BTC USD Price</p>';
$r[]='main-text">BTC USD 匯率</p>';
$s[]='Average % Trend last hour of top 20 altcoins USD Market (CoinMarketCap)';
$r[]='Average % Trend last hour of top 20 altcoins USD Market (CoinMarketCap)';
$s[]='Average % Trend 24 hours of top 20 altcoins USD Market (CoinMarketCap)';
$r[]='Average % Trend 24 hours of top 20 altcoins USD Market (CoinMarketCap)';
$s[]='Average % Trend last 7 days of top 20 altcoins USD Market (CoinMarketCap)';
$r[]='Average % Trend last 7 days of top 20 altcoins USD Market (CoinMarketCap)';
$s[]='main-text">Trend USD last 1H</p>';
$r[]='main-text">USD 一小時趨勢</p>';
$s[]='main-text">Trend USD last 24H</p>';
$r[]='main-text">USD 一日趨勢</p>';
$s[]='main-text">Trend USD last 7D</p>';
$r[]='main-text">USD 一週趨勢</p>';
$s[]='full-text">Current Value</span>';
$r[]='full-text">現值</span>';
$s[]='full-text">Bought Cost</span>';
$r[]='full-text">買價</span>';
$s[]='class="full-text">Difference</span>';
$r[]='class="full-text">差異</span>';
$s[]='full-text">Total Cost</span>';
$r[]='full-text">花費</span>';
$s[]='full-text">Target Value</span>';
$r[]='full-text">目標價</span>';
$s[]='full-text">Sold Value</span>';
$r[]='full-text">賣價</span>';
$s[]='The current value of your pair coins';
$r[]='The current value of your pair coins';
$s[]='The current value of your pending coins';
$r[]='The current value of your pending coins';
$s[]='The current value of your DCA coins';
$r[]='The current value of your DCA coins';
$s[]='short-text">CV</span>';
$r[]='short-text">現值</span>';
$s[]='The difference between Current Value and Bought Cost';
$r[]='The difference between Current Value and Bought Cost';
$s[]='The difference between Current Value and Total Cost';
$r[]='The difference between Current Value and Total Cost';
$s[]='The difference between Bought Cost and Sold Value';
$r[]='The difference between Bought Cost and Sold Value';
$s[]='The bought cost of your sold coins';
$r[]='The bought cost of your sold coins';
$s[]='short-text">BC</span>';
$r[]='short-text">買價</span>';
$s[]='The bought cost of your pair coins';
$r[]='The bought cost of your pair coins';
$s[]='short-text">TC</span>';
$r[]='short-text">花費</span>';
$s[]='The target value of your pending coins';
$r[]='The target value of your pending coins';
$s[]='short-text">TV</span>';
$r[]='short-text">目標價</span>';
$s[]='The sold value of your sold coins';
$r[]='The sold value of your sold coins';
$s[]='short-text">SV</span>';
$r[]='short-text">賣價</span>';
$s[]='Your profit from last week';
$r[]='Your profit from last week';
$s[]='main-text">Profit Last Week</p>';
$r[]='main-text">上週收益</p>';
$s[]='Your profit from last week';
$r[]='Your profit from last week';
$s[]='main-text">Profit Yesterday</p>';
$r[]='main-text">昨日收益</p>';
$s[]='Your profit from today';
$r[]='Your profit from today';
$s[]='main-text">Profit Today</p>';
$r[]='main-text">今日收益</p>';
$s[]='ProfitTrailer Version';
$r[]='ProfitTrailer Version';
$s[]='Pending Order Time';
$r[]='Pending Order Time';
$s[]='SOM: </label>';
$r[]='出貨模式 SOM: </label>';
$s[]='SOMO: </label>';
$r[]='SOMO: </label>';
$s[]='Sell Only Mode Override';
$r[]='Sell Only Mode Override';
$s[]='<!-- SETTINGS -->';
$r[]='<!-- BOT -->
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
        <!-- SETTINGS -->';
return str_replace($s,$r,$in);
}