var prg_notepad_pid = null;
var prg_notepad_wid = null;

var prg_notepad_win = null;
var prg_notepad_container = null;

var prg_notepad_div = null;

function prg_notepad_init(pid, wid)
{
	// Store info
	prg_notepad_pid = pid;
	prg_notepad_wid = wid;

	prg_notepad_win = $("#window" + wid);
	prg_notepad_container = prg_notepad_win.children(".mid").children(".mid").children(".container");

	// Load Window HTML
	$.get("./programs/notepad/window.html", function(response)
	{
		prg_notepad_container.html(response);

		prg_notepad_div = prg_notepad_container.children(".mid").children(".mid").children(".wrap").children(".doc");
	});
}

function prg_notepad_changeTitle(path)
{
	var title = path;

	setWindowTitle(prg_notepad_wid, title);
}

function prg_notepad_loadTxt(path)
{
	$.get("./drive_c/" + path, function(data)
	{
		prg_notepad_div.val(data);
	});
}