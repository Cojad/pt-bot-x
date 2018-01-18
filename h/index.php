<?php
$_p1=$_SERVER['HTTP_HOST'];  //pt0.ass.tw
$_p2=explode(".", $_p1)[0];  //pt0
$_p3=intval(substr($_p2,2)); //0
$_p4=$_p3+8080;              //8080+0

$ch=curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:$_p4/");
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_COOKIE, http_build_query($_COOKIE, null, '; '));
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER["HTTP_USER_AGENT"]);
$raw=curl_exec($ch);
$redirectURL = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL );


if(stripos($redirectURL,"/login")!==false){
	header("location: https://$_p1/login");
} else if(stripos($redirectURL,"/monitoring")!==false){
  header("location: https://$_p1/monitoring");
} else {
  header("location: /_/");
}
?>