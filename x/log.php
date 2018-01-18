<?php
$_p1=$_SERVER['HTTP_HOST'];  //pt0
$_p2=explode(".", $_p1)[0];  //pt0
$_p3=intval(substr($_p2,2)); //0
$_p4=$_p3+8080;              //8080+0

require 'PHPTail.php';
$tail = new PHPTail(array(
    "Access_Log" => "/home/$_p2/files/pt.log",
),
		3000 //更新間隔
);
if(isset($_GET['ajax']))  {
    echo $tail->getNewLines($_GET['file'], $_GET['lastsize'], $_GET['grep'], $_GET['invert']);
    die();
}
$tail->generateGUI();