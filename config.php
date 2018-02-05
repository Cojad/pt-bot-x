<?php
/*
   For Multiple PT Bot in one machine:
   If you host multiple PT Bot in same machine,
   define domain name and corresponding username
   and pt listen port number below in $domains

   you may define $domains array in domains.php in
   same directory as config.php

   For Single PT bot:
   If you only use single PT Bot, comment out or
   remove $domains array.

   Default is user "pt0" with port "8080"
*/
$domains = [
// Domain   for username, pt port
 "localhost"  => [ "pt0", 8080],
 "127.0.0.1"  => [ "pt0", 8080],
 "pt0.ass.tw" => [ "pt0", 8080],
 "pt1.ass.tw" => [ "pt1", 8081],
 "pt2.ass.tw" => [ "pt2", 8082],
];
if(file_exists("domains.php"))
  include "domains.php";

$user="pt0";
$port="8080";
$host=$_SERVER['HTTP_HOST'];
if(isset($domains) && array_key_exists($host, $domains)){
	$user=$domains[$host][0];
	$port=$domains[$host][1];
}

// default interface language (en,zhTW)
$lang="zhTW";

// profit trailer url
$url="http://127.0.0.1:$port";

// profit trailer bot install path
$path_pt="/bot/$user";

// profit trailer bot log path by php exec()
$path_pt_log="/bot/$user/pt.log";

// cmd to start and stop bot by php exec()
// in order for user www-data/apache..etc to do sudo
// please use visudo to give php user permission to sudo
// the script, or you may use differnt ways to start/stop
// PT bot, try use your imagination :)
$script_bot_on        = "sudo /bot/ptbot.sh start $user";
$script_bot_off       = "sudo /bot/ptbot.sh stop $user";

// cmd to clear log by php exec()
$script_bot_log_clear = "sudo /bot/ptbot.sh clear $user";
?>
