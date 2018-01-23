<?php
/*
 * /js/script.js 語系檔案
 *
*/
function lang_script($in){
$s[]='const TABLE_REFS = getTableRefs($);';
$r[]='const TABLE_REFS = getTableRefs($);
  //Overrite default contant text in constants.js
  PBConstants.AJAX_ERROR_MSG = "更新資料錯誤. " +
    "請檢查你的VPS/PT是否運作並可連線. 如果你的VPS/PT都正常, " +
    "喝杯啤酒或抽根菸, 這錯誤應該很快就會消失.",
  PBConstants.PROCESSING_ERR = "處理PT的資料發生錯誤了. " +
    "請給ProfitTrailer一些愛, 來杯咖啡, 一切都將會沒事的.",
  PBConstants.CONFIGURATION_SUCCESS_MSG = "設定已經儲存",
  PBConstants.CONFIGURATION_NOT_SAVED = "設定還沒儲存, 你確定你要離開這個頁面嗎?"';
return str_replace($s,$r,$in);
}