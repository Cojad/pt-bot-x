<?php
header("x-by: Cojad");
$fileName = $_GET["fileName"] ?? "";

switch ($fileName) {
	case "application.properties":
	case "configuration.properties":
	case "trading/PAIRS.properties":
	case "trading/DCA.properties":
	case "trading/INDICATORS.properties":
		header("x-fileName: $fileName");
		header("x-status: Ok");
		file_put_contents("../../pt/$fileName",file_get_contents("php://input"));
		break;

	default:
		header("x-fileName: $fileName");
		header("x-status: Error");
		header("HTTP/1.1 400 Bad Request");
		break;
}
?>