var prg_photoview_pid = null;
var prg_photoview_wid = null;

var prg_photoview_win = null;
var prg_photoview_container = null;

var prg_photoview_div = null;

function prg_photoview_init(pid, wid)
{
	// Store info
	prg_photoview_pid = pid;
	prg_photoview_wid = wid;

	prg_photoview_win = $("#window" + wid);
	prg_photoview_container = prg_photoview_win.children(".mid").children(".mid").children(".container");

	// Load Window HTML
	$.get("./programs/photoview/window.html", function(response)
	{
		prg_photoview_container.html(response);

		prg_photoview_div = prg_photoview_container.children(".mid").children(".mid").children(".wrap");
	});
}

function prg_photoview_changeTitle(path)
{
	var title = path;

	setWindowTitle(prg_photoview_wid, title);
}

function prg_photoview_loadPhoto(path)
{
	prg_photoview_div.html('<img id="img" src="./drive_c/' + path + '" />');
}