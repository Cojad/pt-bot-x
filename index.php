<?php
require("config.php");
$uri = $_SERVER["REQUEST_URI"];
header("by: Cojad");
header("uri: $uri");
$lang = $_COOKIE["lang"] ?? $lang ?? "en";
if(in_array($lang,["zhTW","en"]) == false){
	$lang = "en";
}

if(strpos($uri,"/x/")!== false){ // 所有 /x/xxx 的擴充功能
  x_function($uri);
} else if(strpos($uri,"/bot?")!== false){
	header("Location: /monitoring");
} else if(strpos($uri,"/settings/load?")!== false){
  loadConfig();
} else if(strpos($uri,"/settings/save?")!== false){
  saveConfig();
} else{
	proxy("$url$uri");
	if($httpCode == 200) {
	  if(is_file("ptx/lang_$lang.php")){
	  	include("ptx/lang_$lang.php");
	  } else {
	  	define_default();
	  }
		preg_match('@/monitoring[^/]*$@i', $uri, $matches);
		if(count($matches)){
			include("ptx/ptx.php");
			$body=ptx_monitor($body);
			if(is_file("ptx/lang_{$lang}_monitoring.php")){
				include("ptx/lang_{$lang}_monitoring.php");
				$body=lang_monitoring($body);
			}
		}
		preg_match('@/js/script.js[^/]*$@i', $uri, $matches);
		if(count($matches)){
			include("ptx/ptx.php");
			$body=ptx_script($body);
		}
	  echo $body;
	} else if($httpCode == 0) {
		echo "Server is offline";
	} else if($httpCode >= 300 and $httpCode < 400 ) {
		header("Location: $location", true, $httpCode);
	} else if($httpCode == 404) {
		echo $body;
	} else if($httpCode == 405) {	//oops something when wrong!
		error_log(date("Ymd His") . " http($httpCode): $url$uri\n",3,"ptx.log");
		echo $body;
	} else { // 40x,50x and other codes
	  error_log(date("Ymd His") . " http($httpCode): $url$uri\n",3,"ptx.log");
	  echo $body;
	}
}

function define_default(){
  define("MENU_BOT"," Bot Admin");
  define("MENU_SUB_POWER","Bot Control");
  define("MENU_SUB_APPLICATION","Application");
  define("BUT_BOT_ON"," Start");
  define("BUT_BOT_OFF"," Stop");
  define("BUT_BOT_CLEAR_LOG"," Clear log");
}

function proxy($curl_url){
	global $body,$httpCode,$location;
	$ch=curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $curl_url);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
	curl_setopt($ch, CURLOPT_COOKIE, http_build_query($_COOKIE, null, '; '));
	curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);
	curl_setopt($ch, CURLOPT_HEADER, 1);
	if(!empty($_POST)){ //Normal Post
		curl_setopt($ch, CURLOPT_POST, true);
	  curl_setopt($ch, CURLOPT_POSTFIELDS, $_POST);
	}
	if(!empty($_SERVER["CONTENT_TYPE"])){ //Body Post file upload
	  $post=file_get_contents("php://input");
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
	    'Content-Type: ' . $_SERVER["CONTENT_TYPE"],
	    'Content-Length: ' . strlen($post))
	  );
	}

	$raw =  curl_exec($ch);
	$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
	$header = substr($raw, 0, $header_size);
	$body = substr($raw, $header_size);
	// Handle cookie header
	preg_match('/^Set-Cookie:\s*([^;]*)/mi', $header, $matches);
	if(count($matches)>0){
	  $cookie=$matches[0];
	  header($cookie);
	};
	// Handle content-type header
	$contentTpye = curl_getinfo($ch,CURLINFO_CONTENT_TYPE );
	if(!empty($contentTpye)){
		header("Content-Type: $contentTpye");
	}
	// Handle locaiotn header
	preg_match_all('/^Location:.*/mi', $header, $matches);
	if(count($matches[0])>0){
		$location=$matches[0][0];
		if(strpos($location,"//")!==false){
			 preg_match('@://[^/]*?(/.*)@i', $header, $matches);
			 $location=$matches[1];
		}
	};
	$httpCode = curl_getinfo($ch,CURLINFO_HTTP_CODE );
	http_response_code($httpCode);
}

function loadConfig() {
	global $path_pt;
 	$fileName = $_GET["fileName"] ?? "";
	switch ($fileName) {
		case "application.properties":
		case "configuration.properties":
		case "trading/PAIRS.properties":
		case "trading/DCA.properties":
		case "trading/INDICATORS.properties":
  		header("content-type: application/json;charset=UTF-8");
			echo json_encode(file_get_contents("$path_pt/$fileName"));
			break;
		default:
			header("HTTP/1.1 400 Bad Request");
			break;
	}
}
function saveConfig() {
	global $path_pt;
 	$fileName = $_GET["fileName"] ?? "";
	switch ($fileName) {
		case "application.properties":
		case "configuration.properties":
		case "trading/PAIRS.properties":
		case "trading/DCA.properties":
		case "trading/INDICATORS.properties":
  		file_put_contents("$path_pt/$fileName",file_get_contents("php://input"));
			break;
		default:
			header("HTTP/1.1 400 Bad Request");
			break;
	}
}
function showLog() {
	global $path_pt_log;
	require 'ptx/PHPTail.php';
	$tail = new PHPTail(["Log" => $path_pt_log],3000);
	if(isset($_GET['ajax'])) {
    die($tail->getNewLines($_GET['file'], $_GET['lastsize'], $_GET['grep'], $_GET['invert']));
	}
	$tail->generateGUI();
}
function x_function($uri) {
	if(strpos($uri, '/x/log') !== false) {
	  showLog();
	} else if(strpos($uri, '/x/on') !== false) {
		exec($script_bot_on, $out);
    echo join("<br>\n",$out);
	} else if(strpos($uri, '/x/off') !== false) {
		exec($script_bot_off, $out);
    echo join("<br>\n",$out);
	} else if(strpos($uri, '/x/clear') !== false) {
		exec($script_bot_log_clear,$out);
    echo join("<br>\n",$out);
	} else if(strpos($uri, '/x/lang') !== false) {
		$lang = $_GET["lang"] ?? "en";
		if(in_array($lang,["zhTW","en"]) == false){
			$lang = "en";
		}
		//setcookie("lang", $lang, 604800, "/");
		setcookie("lang", $lang, strtotime( '+30 days' ) ,"/",$_SERVER["HTTP_HOST"]);
		//Set-Cookie: _pbpw8081=62d081b4fe05d83f2ef91c1e63774c83; Max-Age=604800; Expires=Mon, 29-Jan-2018 16:20:22 GMT; HttpOnly
    header("Location: /monitoring");
	} else {
		header("HTTP/1.1 400 Bad Request");
	}
}
