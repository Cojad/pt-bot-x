<?php
require("config.php");
$uri = $_SERVER["REQUEST_URI"];
header("by: Cojad");
header("uri: $uri");
$lang = $_COOKIE["lang"] ?? $lang ?? "en";
if(in_array($lang,["zhTW","en"]) == false){
	$lang = "en";
}
if(is_file("ptx/lang_$lang.php")){
	include("ptx/lang_$lang.php");
} else {
	define_default();
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
		if(is_login()){
			if(in_array($uri,["/monitoring"])){
				include("ptx/ptx.php");
				$body=ptx_monitor(file_get_contents("templates/index.ftl"));
				if(is_file("ptx.log/lang_{$lang}_monitoring.php")){
					include("ptx/lang_{$lang}_monitoring.php");
					$body=lang_monitoring($body);
				}
				echo $body;
  		} else if(strpos($uri,"/js/script.js")!== false){
  			include("ptx/ptx.php");
  			echo ptx_script(file_get_contents("js/scriptX.js"));
  		} else if(strpos($uri,"/login")!== false) {
  			if(empty($_POST["password"])){
					$body=file_get_contents("templates/login.ftl");
					$body=preg_replace("/<#if demoPassword\?\?>.*<\/#if>/s", "", $body);
					echo $body;
				} else {
					//setcookie("_pbpw$port", md5($_POST["password"] . "PBSE123CRET56342"), strtotime( '+7 days' ),"","",false,true /*,"/",$_SERVER["HTTP_HOST"]*/);
					$date = date("D, d M Y H:i:s",strtotime('+ 7 days')) . 'GMT';
					header("set-cookie: _pbpw$port=" . md5($_POST["password"] . "PBSE123CRET56342") . "; Max-Age=604800; Expires={$date}; HttpOnly");
					//set-cookie: _pbpw8080=c103767014387aca7d07063d72bab15d; Max-Age=604800; Expires=Mon, 29-Jan-2018 20:19:34 GMT; HttpOnly


					header("location: /monitoring");
				}
			} else if(in_array($uri,["/"])) {
				header("location: /monitoring");
  		} else {
				http_response_code(503);
				echo "Server is offline(login)";

			}

		} else {
			if(strpos($uri,"/login")!== false){
				if(empty($_POST["password"])){
					$body=file_get_contents("templates/login.ftl");
					$body=preg_replace("/<#if demoPassword\?\?>.*<\/#if>/s", "", $body);
					echo $body;
				} else {
					header("set-cookie: _pbpw$port=" . md5($_POST["password"] . "PBSE123CRET56342") . "; Max-Age=604800; Expires={$date}; HttpOnly");
					header("location: /monitoring");
				}
			} else {
				header("location: /login");
			}
		}

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
	preg_match('/(^Set-Cookie:\s?.*)/mi', $header, $matches);
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
	global $script_bot_on,$script_bot_off,$script_bot_log_clear;
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
function parse_ini($str) {
    if(empty($str)) return false;
    $lines = explode("\n", $str);
    $ret = Array();
    $inside_section = false;
    foreach($lines as $line) {
        $line = trim($line);
        if(!$line || $line[0] == "#" || $line[0] == ";") continue;
        if($line[0] == "[" && $endIdx = strpos($line, "]")){
            $inside_section = substr($line, 1, $endIdx-1);
            continue;
        }
        if(!strpos($line, '=')) continue;
        $tmp = explode("=", $line, 2);
        if($inside_section) {
            $key = rtrim($tmp[0]);
            $value = ltrim($tmp[1]);
            if(preg_match("/^\".*\"$/", $value) || preg_match("/^'.*'$/", $value)) {
                $value = mb_substr($value, 1, mb_strlen($value) - 2);
            }
            $t = preg_match("^\[(.*?)\]^", $key, $matches);
            if(!empty($matches) && isset($matches[0])) {
                $arr_name = preg_replace('#\[(.*?)\]#is', '', $key);
                if(!isset($ret[$inside_section][$arr_name]) || !is_array($ret[$inside_section][$arr_name])) {
                    $ret[$inside_section][$arr_name] = array();
                }
                if(isset($matches[1]) && !empty($matches[1])) {
                    $ret[$inside_section][$arr_name][$matches[1]] = $value;
                } else {
                    $ret[$inside_section][$arr_name][] = $value;
                }
            } else {
                $ret[$inside_section][trim($tmp[0])] = $value;
            }
        } else {
            $ret[trim($tmp[0])] = ltrim($tmp[1]);
        }
    }
    return $ret;
}
function is_login(){
	global $path_pt,$port,$ini;
	$file = @file_get_contents("$path_pt/application.properties");
	$ini = parse_ini($file);
	$pass = $ini["server.password"] ?? "";
	$port = $ini["server.port"] ?? "8080";
	$md5_pass = md5($pass . "PBSE123CRET56342");
	$user_pass = $_COOKIE["_pbpw$port"] ?? "";
	return $md5_pass == $user_pass;
}