
<?php
$IP=$_GET["ip"];
$Key=$_GET["key"];
if($IP=="") $IP="192.168.1.201";
if($Key=="") $Key="0";
?>

<?php
if($_GET["ip"]!=""){
	$Connect = fsockopen($IP, "80", $errno, $errstr, 1);
	if($Connect){
		$soap_request="<ClearData><ArgComKey xsi:type=\"xsd:integer\">".$Key."</ArgComKey><Arg><Value xsi:type=\"xsd:integer\">3</Value></Arg></ClearData>";
		$newLine="\r\n";
		fputs($Connect, "POST /iWsService HTTP/1.0".$newLine);
	    fputs($Connect, "Content-Type: text/xml".$newLine);
	    fputs($Connect, "Content-Length: ".strlen($soap_request).$newLine.$newLine);
	    fputs($Connect, $soap_request.$newLine);
		$buffer="";
		while($Response=fgets($Connect, 1024)){
			$buffer=$buffer.$Response;
		}
	}else echo "Koneksi Gagal";
	include("parse.php");	
	$buffer=Parse_Data($buffer,"<Information>","</Information>");
	//echo "<B>Result:</B><BR>";
	$data['result']=$buffer;
	if($buffer==""){
		$data['result']="0";
		$data['message']="Failed to delete";
	}else{
		$data['result']="1";
		$data['message'] = $buffer;
	}
	echo json_encode($data);
}	
?>

