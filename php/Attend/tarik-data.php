

<?php
function Parse_Data($data,$p1,$p2){
	$data=" ".$data;
	$hasil="";
	$awal=strpos($data,$p1);
	if($awal!=""){
		$akhir=strpos(strstr($data,$p1),$p2);
		if($akhir!=""){
			$hasil=substr($data,$awal+strlen($p1),$akhir-strlen($p1));
		}
	}
	return $hasil;	
}

$IP=$_GET["ip"];
$Key=$_GET["key"];
if($IP=="") $IP="192.168.1.201";
if($Key=="") $Key="0";
?>


<?php
if($_GET["ip"]!=""){?>
	
	<?php
	$Connect = fsockopen($IP, "80", $errno, $errstr, 1);
	if($Connect){
		$soap_request="<GetAttLog><ArgComKey xsi:type=\"xsd:integer\">".$Key."</ArgComKey><Arg><PIN xsi:type=\"xsd:integer\">All</PIN></Arg></GetAttLog>";
		//echo $soap_request;
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
	
	//include "parse.php";
	$buffer=Parse_Data($buffer,"<GetAttLogResponse>","</GetAttLogResponse>");
	$buffer=explode("\r\n",$buffer);
	$response = array();
	for($a=0;$a<count($buffer);$a++){
		$data=Parse_Data($buffer[$a],"<Row>","</Row>");
		$res = array();
		$res['pin']=Parse_Data($data,"<PIN>","</PIN>");
		$res['tanggal']=Parse_Data($data,"<DateTime>","</DateTime>");
		$res['verified']=Parse_Data($data,"<Verified>","</Verified>");
		$res['status']=Parse_Data($data,"<Status>","</Status>");

		if($res['pin']==""){
			$res = "";
		}else{
			array_push($response, $res);
		}
	?>
		
	<?php }
	echo json_encode($response); ?>
<?php } ?>


