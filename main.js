var id = 0;

var hours = 3;
var minutes = 21;
var am = true;

var menuOptions = 4;
var menuDividers = 1;

var startPressed = false;
var dragging = false;

function init()
{
	// Disable normal right click
	$(document).on("contextmenu", function(e)
	{
		if (e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA")
			e.preventDefault();
	});

	// Misc.
	$(document).mouseup(function()
	{
		$(".window").draggable("disable");
		dragging = false;
	});

	$(document).resize(function()
	{
		var d = $("#desktop");
		d.css({
			"top":	"0px",
			"left":	"0px" 
		});

		$("#footer").css({
			"top":	d.height(),
			"left":	"0px"
		});
	});

	$("body").click(handleGenericClick);
	$("#btn_start").click(pressStart);

	$(".menu_option").mouseover(highlightOption);
	$(".menu_option").mouseout(dehighlightOption);

	setInterval(updateTime, 60000);
	setInterval(cycleStep, 200);

	createWindow("Test Window", 400, 300);
}

function cycleStep()
{
	// Fix position of taskbar and desktop
	$("body").scrollTop(0);
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

function createWindow(title, width, height)
{
	// Create window
	$("#desktop").append('<div class="window" id="window' + id + '"></div>');

	var win = $("#window" + id);

	// Set size
	win.css({
		"width":	width,
		"height":	height 
	});

	// Create inner divs
	win.append('<div class="top"><div class="corner_topleft"></div><div class="side_top"></div><div class="corner_topright"></div></div>');
	win.append('<div class="mid"><div class="side_left"></div><div class="mid"><div class="bar"></div></div><div class="side_right"></div></div>');
	win.append('<div class="bot"><div class="corner_botleft"></div><div class="side_bot"></div><div class="corner_botright"></div></div>');

	// Make the window draggable, but disable dragging initially
	win.draggable({
		"containment": $("#desktop")
	});
	win.draggable("disable");

	// Set title
	var bar = win.children(".mid").children(".mid").children(".bar");
	bar.append('<div class="title">' + title + '</div>');

	// Add close button
	bar.append('<div class="btn_close"></div>');
	bar.children(".btn_close").click(function ()
	{
		$(this).parent().parent().parent().parent().remove();
	});

	// Make the window draggable by the title bar
	bar.mousedown(function()
	{
		$(this).parent().parent().parent().draggable("enable");
		dragging = true;
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

	menu.css("height", ((menuOptions * 38) + (menuDividers * 2) + 6));

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

function highlightOption()
{
	$(this).css({
		"background-color":		"#000080",
		"color":				"#FFFFFF"
	});
}

function dehighlightOption()
{
	$(this).css({
		"background-color":		"#C0C0C0",
		"color":				"#000000"
	});
}