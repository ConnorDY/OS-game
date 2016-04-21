var prg_demo_pid = null;
var prg_demo_wid = null;

var prg_demo_win = null;
var prg_demo_container = null;

function prg_demo_init(pid, wid)
{
	prg_demo_pid = pid;
	prg_demo_wid = wid;

	prg_demo_win = $("#window" + wid);
	prg_demo_container = prg_demo_win.children(".mid").children(".mid").children(".container");

	prg_demo_container.html(
		"Welcome to this demo where you can interact with a Windows 95 'machine' in your browser!<br /><br />" +
		"Not all features are implemented yet but feel free to explore the system in its current state. May I suggest taking a look at its files?<br /><br />" +
		"Enjoy! :)"
	);
}