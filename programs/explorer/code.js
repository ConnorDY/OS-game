var prg_explorer_pid = null;
var prg_explorer_wid = null;

var prg_explorer_win = null;
var prg_explorer_container = null;

function prg_explorer_init(pid, wid)
{
	prg_explorer_pid = pid;
	prg_explorer_wid = wid;

	prg_explorer_win = $("#window" + wid);
	prg_explorer_container = prg_explorer_win.children(".mid").children(".mid").children(".container");

	prg_explorer_container.html("This is a test.");
}