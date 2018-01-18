<?php
$_p1=$_SERVER['HTTP_HOST'];  //
$_p2=explode(".", $_p1)[0];  //pt0
$_p3=intval(substr($_p2,2)); //0
$_p4=$_p3+8080;              //8080+0

exec("sudo /opt/pclear.sh $_p2",$out);
echo join("<br>\n",$out);
?>
