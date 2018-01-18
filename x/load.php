<?php
header("content-type: application/json;charset=UTF-8");
header("by: Cojad");
$fileName = $_GET["fileName"] ?? "";
switch ($fileName) {
	case "application.properties":
	case "configuration.properties":
	case "trading/PAIRS.properties":
	case "trading/DCA.properties":
	case "trading/INDICATORS.properties":
		header("x-fileName: $fileName");
		header("x-status: Ok");
		echo json_encode(file_get_contents("../../pt/$fileName"));
		break;

	default:
		header("x-fileName: $fileName");
		header("x-status: Error");
		header("HTTP/1.1 400 Bad Request");
		break;
}

?>