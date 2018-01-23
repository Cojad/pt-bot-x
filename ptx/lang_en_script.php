<?php
/*
 * /js/script.js language file
 *
*/
function lang_script($in){
$s[]='<i class="fa fa-wrench"></i><span> Config</span>'; // string to translate from
$r[]='<i class="fa fa-wrench"></i><span> Config</span>'; // string to translate to
return str_replace($s,$r,$in);
}