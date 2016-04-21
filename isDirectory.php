<?php
$drive_c = "./drive_c";

if (isset($_GET["path"]))
{
	$path = $drive_c . $_GET["path"];

	if (strpos($path, "..") !== false) exit;

	if (is_dir($path)) echo "1";
	else echo 0;
}
?>