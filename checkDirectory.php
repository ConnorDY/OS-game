<?php
$drive_c = "./drive_c";

if (isset($_GET["path"]))
{
	$path = $drive_c . $_GET["path"];

	if (strpos($path, "..") !== false) exit;

	$contents = scandir($path);

	// Remove . and ..
	unset($contents[0]);
	unset($contents[1]);
	
	foreach ($contents as $e)
	{
		if (is_dir($path . $e)) echo '?';

		echo $e . "*";
	}
}
?>