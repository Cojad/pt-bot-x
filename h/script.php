<?php
$_p1=$_SERVER['HTTP_HOST'];  //pt0.ass.tw
$_p2=explode(".", $_p1)[0];  //pt0
$_p3=intval(substr($_p2,2)); //0
$_p4=$_p3+8080;              //8080+0

$ch=curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:$_p4/js/script.js?ver=4.3.9");
curl_setopt($ch, CURLOPT_COOKIE, http_build_query($_COOKIE, null, '; '));
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);

header("content-type: text/plain");

$raw=curl_exec($ch);
$s=[];
$r=[];

$s[]="    'config': {";
$r[]="    'bot': {
      template: 'tmplBot',
      heading: 'BOT 管理',
      callback: cbBotControl,
      refresh: false
    },
    'config': {";
$s[]="  function cbLoadConfig () {";
$r[]="  function cbBotControl () {
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

echo str_replace($s,$r,$raw);

?>