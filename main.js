var id = 0;

var hours = 3;
var minutes = 21;
var am = true;

var menuOptions = 4;

var startPressed = false;

function init()
{
	$("body").click(handleGenericClick);
	$("#btn_start").click(pressStart);

	setInterval(updateTime, 60000);

	createWindow();
}

function updateTime()
{
	minutes++;

	if (minutes >= 60)
	{
		minutes = 0;
		hours++;

		if (hours == 12) am = !am;
	}

	if (hours > 12) hours = 1;

	var timeStr = hours + ":" + (minutes > 9 ? "" : "0") + minutes + " " + (am ? "AM" : "PM");
	$("#time").html(timeStr);
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

function handleGenericClick(e)
{
	var target = $(e.target);

	if (!target.is("#btn_start")) closeStart();
}

function pressStart()
{
	startPressed = !startPressed;

	if (startPressed) openStart();
	else closeStart();
}

function openStart()
{
	var btn = $("#btn_start");
	var menu = $("#menu_start");

	btn.css("background-image", "url(\"./res/start_pressed.png\")");

	menu.css("height", ((menuOptions * 38) + 2 + 6));

	menu.css({
		"display":	"block",
		"top":		(btn.offset().top - menu.height() + 4)
	});

	startPressed = true;
}

function closeStart()
{
	$("#btn_start").css("background-image", "url(\"./res/start.png\")");
	$("#menu_start").css("display", "none");

	startPressed = false;
}