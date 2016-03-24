var id = 0;
var startPressed = false;

function init()
{
	$("#btn_start").click(pressStart);

	createWindow();
}

function createWindow()
{
	// Create window
	$("#desktop").append('<div class="window" id="window' + id + '"></div>');

	var win = $("#window" + id);

	// Add title bar, make it draggable, then disable dragging
	win.append('<div class="bar">Window</div>');
	win.draggable();
	win.draggable("disable")

	// Make the window draggable by the title bar
	bar = win.children(".bar");

	bar.mousedown(function()
	{
		$(this).parent().draggable("enable");
	});

	bar.mouseup(function()
	{
		$(this).parent().draggable("disable");
	});

	// Increase ID value
	id++;
}

function pressStart()
{
	startPressed = !startPressed;
	var btn = $("#btn_start");

	if (startPressed)
	{
		btn.css("background-image", "url(\"./res/start_pressed.png\")");
	}
	else
	{
		btn.css("background-image", "url(\"./res/start.png\")");
	}
}