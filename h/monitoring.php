<?php
$_p1=$_SERVER['HTTP_HOST'];  //pt0.ass.tw
$_p2=explode(".", $_p1)[0];  //pt0
$_p3=intval(substr($_p2,2)); //0
$_p4=$_p3+8080;              //8080+0

$ch=curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:$_p4/monitoring");
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_COOKIE, http_build_query($_COOKIE, null, '; '));
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);

$raw=curl_exec($ch);
$redirectURL = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL );
if(stripos($redirectURL,"/login")!==false){
	header("location: /login");
};
if(empty($raw)){
  header("location: /_/");
  die();
}
$s=[];
$r=[];
$s[]='<li id="defaultPage">';
$r[]='<li class="has_sub" id="configBot" style="display: list-item;">
                          <a href="javascript:void(0);" class="waves-effect waves-primary config"><i class="fa fa-wrench"></i><span>PT Bot管理</span>
                          <span class="menu-arrow"></span></a>
                          <ul class="list-unstyled" style="display: none;">
                            <li><a href="bot?file=onoff">開關機</a></li>
                            <li><a href="config?file=application.properties">設定</a></li>
                          </ul>
                        </li>' .
'                        <li id="defaultPage">';
$s[]='<i class="fa fa-wrench"></i><span> Config</span>';
$r[]='<i class="fa fa-wrench"></i><span>設定檔</span>';
$s[]='<li><a href="config?file=configuration.properties">Configuration</a></li>';
$r[]='<li><a href="config?file=configuration.properties">基本設定</a></li>';
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
$s[]='short-text">CV</span>';
$r[]='short-text">現值</span>';
$s[]='short-text">BC</span>';
$r[]='short-text">買價</span>';
$s[]='short-text">TC</span>';
$r[]='short-text">花費</span>';
$s[]='short-text">TV</span>';
$r[]='short-text">目標價</span>';
$s[]='short-text">SV</span>';
$r[]='short-text">賣價</span>';

$s[]='main-text">Profit Last Week</p>';
$r[]='main-text">上週收益</p>';
$s[]='main-text">Profit Yesterday</p>';
$r[]='main-text">昨日收益</p>';
$s[]='main-text">Profit Today</p>';
$r[]='main-text">今日收益</p>';

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
	          	<iframe id="logIFrame" src="/x/log" width="100%" height="100%"></iframe>
	          </div>
          </div>
        </div>
        <!-- end BOT -->
        <!-- SETTINGS -->';

echo str_replace($s,$r,$raw);

?>