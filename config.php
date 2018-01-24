<?php
$pt="pt0";

// default interface language (en,zhTW)
$lang="zhTW";

// profit trailer url
$url="http://127.0.0.1:8080";

// profit trailer bot install path
$path_pt="/home/$pt/pt";

// profit trailer bot log path by php exec()
$path_pt_log="/home/$pt/files/pt.log";

// cmd to start and stop bot by php exec()
$script_bot_on="sudo /opt/pstart.sh $pt";
$script_bot_off="sudo /opt/pstop.sh $pt";

// cmd to clear log by php exec()
$script_bot_log_clear="sudo /opt/pclear.sh $pt";
?>
