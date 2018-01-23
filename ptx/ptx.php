<?php
function ptx_monitor($in){ // /monitoring 強化
$s[]='<li id="defaultPage">';
$r[]='<li class="has_sub" id="configBot" style="display: list-item;">
                          <a href="javascript:void(0);" class="waves-effect waves-primary config"><i class="fa fa-cog"></i><span>' . MENU_BOT . '</span>
                          <span class="menu-arrow"></span></a>
                          <ul class="list-unstyled" style="display: none;">
                            <li><a href="bot?file=onoff"><i class="fa fa-plug"></i>' . MENU_SUB_POWER . '</a></li>
                            <li><a href="config?file=application.properties"><i class="fa fa-microchip" aria-hidden="true"></i>' . MENU_SUB_APPLICATION .'</a></li>
                            <li><a href="/x/lang?lang=en"><i class="fa fa-font"></i> English</a></li>
                            <li><a href="/x/lang?lang=zhTW"><i class="fa fa-language"></i> 正體中文</a></li>
                          </ul>
                        </li>' .
'                        <li id="defaultPage">';
$s[]='<li><a href="config?file=configuration.properties">Configuration</a></li>';
$r[]='<li><a href="config?file=application.properties">' . MENU_SUB_APPLICATION . '</a></li>
                            <li><a href="config?file=configuration.properties">Configuration</a></li>';
$s[]='<li><a href="config?file=trading/hotconfig">HotConfig</a></li>';
$r[]='<li><a href="config?file=trading/hotconfig">HotConfig</a></li>
                          </ul>
                        </li>
                        <li class="has_sub" id="configSOM" style="display:none;">
                          <a href="javascript:void(0);" class="waves-effect waves-primary config"><i class="fa fa-cog"></i><span>' . MENU_SOM . '</span>
                          <span class="menu-arrow"></span></a>
                          <ul class="list-unstyled" style="display: none;">
                            <li><a href="/settings/sellOnlyMode?type=&enabled=true"> Sell Only Mode On</a></li>
                            <li><a href="settings/sellOnlyMode?type=&enabled=false"> Sell Only Mode Off</a></li>
                            <li><a href="settings/overrideSellOnlyMode?enabled=false"> Override SOM</a></li>
                            <li><a href="/settings/overrideSellOnlyMode"> Reset SOM</a></li>';
$s[]='<!-- end SETTINGS -->';
$r[]='<!-- end SETTINGS -->
        <!-- BOT -->
        <div id="tmplBot" class="hide">
          <div id="configurationContainer" class="row">
            <div class="col-12 configuration-heading-container">
              <button type="button" style="cursor: pointer;color: #ffffff;" class="btn btn-primary btn-sm bot-on"><i class="fa fa-rocket" aria-hidden="true"></i>' . BUT_BOT_ON . '</button>&nbsp;&nbsp;&nbsp;
              <button type="button" style="cursor: pointer;color: #ffffff;" class="btn btn-danger btn-sm bot-off"><i class="fa fa-power-off" aria-hidden="true"></i>' . BUT_BOT_OFF . '</button>&nbsp;&nbsp;&nbsp;
              <button type="button" style="cursor: pointer;color: #ffffff;" class="btn btn-warning btn-sm bot-clear"><i class="fa fa-times" aria-hidden="true"></i>' . BUT_BOT_CLEAR_LOG . '</button>
            </div>
            <div class="bot-container editor-container col-12" style="">
              <iframe id="logIFrame" src="" width="100%" height="100%"></iframe>
            </div>
          </div>
        </div>
        <!-- end BOT -->
';

return str_replace($s,$r,$in);
}

function ptx_script($in){ // /js/script.js 強化
$s[]="page('Monitoring');";
$r[]="page('monitoring');";
$s[]="    'config': {";
$r[]="    'bot': {
      template: 'tmplBot',
      heading: '" . MENU_SUB_POWER . "',
      callback: cbBotControl,
      refresh: false
    },
    'config': {";
$s[]="  function cbLoadConfig () {";
$r[]="  function showMainMenu () {
    // If Server is online
    console.log('show');
    \$configurationMenu.show();
    $('#configSOM').show();
    $('#sidebar-menu > ul >li').each(function(){if(this.id=='')
        $(this).show();
    });
  }
  function hideMainMenu () {
    console.log('hide');
    // If Server is offline
    \$configurationMenu.show();
    $('#configSOM').hide();
    $('#sidebar-menu > ul >li').each(function(){if(this.id=='')
      $(this).hide();
    });
  }
  function cbBotControl () {
		setConfigurationContainerHeight();
    $('#logIFrame').attr('src','/x/log');
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
      $('#logIFrame').attr('src','/x/log');
    })
    .fail(function() {
      alert( 'error' );
    })
  });
  function cbLoadConfig () {";
$s[]="const \$configurationMenu = $('#configMenu');";
$r[]="const \$configurationMenu = $('#configMenu,#configSOM');";
$s[]="showOrHideConfigurationMenu(data);";
$r[]="//showOrHideConfigurationMenu(data);";
$s[]="if (responseData.processStatus === false) {";
$r[]="if (responseData.processStatus !== false) {
          showMainMenu();
        } else {
          hideMainMenu();";
$s[]="}).fail(function () {";
$r[]="}).fail(function () {
        hideMainMenu();";
$s[]="}).always(function () {";
$r[]="}).always(function () {
        console.log('A',serverData);";
return str_replace($s,$r,$in);
}
?>