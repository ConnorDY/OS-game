var prg_explorer_pid = null;
var prg_explorer_wid = null;

var prg_explorer_win = null;
var prg_explorer_container = null;

function prg_explorer_init(pid, wid)
{
	// Store info
	prg_explorer_pid = pid;
	prg_explorer_wid = wid;

	prg_explorer_win = $("#window" + wid);
	prg_explorer_container = prg_explorer_win.children(".mid").children(".mid").children(".container");

	// Add filebar
	var container = prg_explorer_container;
	container.append('<div class="filebar prg_explorer"></div>');

	var filebar = container.children(".filebar");
	filebar.append('<div class="menus"></div>');
	filebar.append('<div class="footer"><div class="left corner"></div><div class="right corner"></div></div>');

	container.append('<div class="mid prg_explorer"></div>');

	var mid = container.children(".mid");
	mid.append('<div class="left"></div><div class="mid"></div><div class="right"></div>');

	container.append('<div class="bot prg_explorer"><div class="left corner"></div><div class="right corner"></div></div>');
}