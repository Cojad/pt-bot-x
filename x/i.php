<?php
$_p1=$_SERVER['HTTP_HOST'];  //pt0
$_p2=explode(".", $_p1)[0];  //pt0
$_p3=intval(substr($_p2,2)); //0
$_p4=$_p3+8080;              //8080+0
echo "$_p1 $_p2 $_p3 $_p4";
?>