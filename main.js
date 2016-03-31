var id = 0;
var pid = 0;

var hours = 3;
var minutes = 21;
var am = true;

var menuOptions = 6;
var menuDividers = 1;

var windowsOpen = 0;
var activeWindow = 0;

var startPressed = false;
var resizingWindow = false;

var temp_mx = 0;
var temp_my = 0;

var tempJSON = null;

var resizePos = -1;

function init()
{
	// Disable normal right click
	$(document).on("contextmenu", function(e)
	{
		if (e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA")
			e.preventDefault();
	});

	// Disable text selection
	$("body").attr('unselectable','on').css(
     {
		'-moz-user-select':		'-moz-none',
		'-moz-user-select':		'none',
		'-o-user-select':		'none',
		'-khtml-user-select':	'none',
		'-webkit-user-select':	'none',
		'-ms-user-select':		'none',
		'user-select':			'none'
     }).bind('selectstart', function(){ return false; });

	// Disable window dragging on release of mouse left
	$(document).mouseup(function()
	{
		$(".window").draggable("disable");
	});

	// Resize interface whenever the window resizes
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

	// Misc.
	$("body").click(handleGenericClick);
	$("#btn_start").click(pressStart);

	$(".menu_option").mouseover(highlightOption);
	$(".menu_option").mouseout(dehighlightOption);

	setInterval(updateTime, 60000);
	setInterval(cycleStep, 50);
	setTimeout(fadeIn, 50);

	// Default set up
	createWindow("Test Window", 400, 300, 0, 0);
	createWindow("Another Test Window", 300, 200, 32, 32);
	createWindow("A Window With a Title That's Pretty Damn Long", 400, 250, 500, 0);
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

function createWindow(title, width, height, x, y)
{
	// Create window
	$("#desktop").append('<div class="window" id="window' + id + '"></div>');
	var win = $("#window" + id);

	// Set size and position
	win.css({
		"width":	width,
		"height":	height,
		"left":		x,
		"top":		y
	});

	// Create inner divs
	win.append('<div class="top"><div class="corner_topleft"></div><div class="side_top"></div><div class="corner_topright"></div></div>');
	win.append('<div class="mid"><div class="side_left"></div><div class="mid"><div class="bar"></div></div><div class="side_right"></div></div>');
	win.append('<div class="bot"><div class="corner_botleft"></div><div class="side_bot"></div><div class="corner_botright"></div></div>');

	var btop = win.children(".top");
	var bmid = win.children(".mid");
	var bbot = win.children(".bot");

	// Make the window draggable, but disable dragging initially
	win.draggable({
		"containment": $("#desktop")
	});
	win.draggable("disable");

	// Make window clickable to activate
	win.click(function()
	{
		var id_ = $(this).attr("id").substring(6);
		activateWindow(id_);
	});

	// Set title
	var bar = bmid.children(".mid").children(".bar");
	bar.append('<div class="title">' + title + '</div>');

	// Add close button
	bar.append('<div class="btn_close"></div>');
	bar.children(".btn_close").click(function()
	{
		var id_ = $(this).parent().parent().parent().parent().attr("id").substring(6);
		closeWindow(id_);
	});

	// Make window resizable
	btop.children().mousedown(resizeWindow);
	bmid.children(".side_left").mousedown(resizeWindow);
	bmid.children(".side_right").mousedown(resizeWindow);
	bbot.children().mousedown(resizeWindow);

	// Make the window draggable and activate by the title bar
	bar.mousedown(function()
	{
		var w = $(this).parent().parent().parent();
		activateWindow(w.attr("id").substring(6));
		w.draggable("enable");
	});

	// Add the window to the taskbar
	$("#windows").append('<div class="windowt" id="windowt' + id + '"><div class="left"></div><div class="mid"></div><div class="right"></div></div>');
	var wint = $("#windowt" + id);

	wint.click(function()
	{
		var id_ = $(this).attr("id").substring(7);
		activateWindow(id_);
	});

	var footerTitle = title;

	// Short footer title if necessary
	if (checkLength(footerTitle, 14) > 178)
	{
		var i = title.length - 2;

		while (i > 3)
		{
			footerTitle = title.substring(0, i) + "...";
			if (checkLength(footerTitle, 14) < 178) break;
			i--;
		}
	}

	wint.children(".mid").append('<div class="title">' + footerTitle + '</div>');
	wint.css("width", (checkLength(footerTitle, 14) + 16) + "px");

	// Set hidden window info and then activate it
	win.append('<div class="hidden info_title">' + title + '</div>');

	activateWindow(id);

	// Increase ID value
	id++;
}

function activateWindow(id_)
{
	var win = $("#window" + id_);
	var wint = $("#windowt" + id_);

	// Reset other windows
	$(".windowt").each(function()
	{
		$(this).children(".left").css("background-image", "url('./res/taskbar/window_left.png')");
		$(this).children(".mid").css("background-image", "url('./res/taskbar/window_mid.png')");
		$(this).children(".right").css("background-image", "url('./res/taskbar/window_right.png')");

		$(this).children(".mid").children(".title").css("top", "6px");
	});

	$(".window").each(function()
	{
		$(this).css("z-index", 0);

		$(this).children(".mid").children(".mid").children(".bar").css({
			"background-color":	"#808080",
			"color":			"#C0C0C0"
		});
	});

	// Set current to active
	wint.children(".left").css("background-image", "url('./res/taskbar/window_left_s.png')");
	wint.children(".mid").css("background-image", "url('./res/taskbar/window_mid_s.png')");
	wint.children(".right").css("background-image", "url('./res/taskbar/window_right_s.png')");

	wint.children(".mid").children(".title").css("top", "7px");

	win.css("z-index", 1);

	win.children(".mid").children(".mid").children(".bar").css({
		"background-color":	"#000080",
		"color":			"#FFFFFF"
	});

	activeWindow = id_;
}

function closeWindow(id_)
{
	var win = $("#window" + id_);
	var wint = $("#windowt" + id_);

	win.remove();
	wint.remove();
}

function resizeWindow(e)
{
	// Get the window element and activate it
	var elem = $(this);
	var win = elem.parent().parent();

	activateWindow(win.attr("id").substring(6));

	// Set temp_mx/y to the current mouse coords
	temp_mx = e.clientX;
	temp_my = e.clientY;

	// Let the system know we are resizing a window
	resizingWindow = true;

	// If the window is being resized by a corner
	if (elem.attr("class").substring(0, 6) == "corner")
	{
		// Determine what corner was selected
		var pos = elem.attr("class").substring(7);

		if (pos == "topleft") resizePos = 0;
		else if (pos == "topright") resizePos = 1;
		else if (pos == "botright") resizePos = 2;
		else if (pos == "botleft") resizePos = 3;
		else resizePos = -1;

		// Function for moving mouse/dragging corner
		$(window).mousemove(function(e)
		{
			// Determine the change in mouse position
			var mx = e.clientX;
			var my = e.clientY;

			if (mx < 0) mx = 0;
			if (my < 0) my = 0;

			var dw = mx - temp_mx;
			var dh = my - temp_my;

			temp_mx = mx;
			temp_my = my;

			// Resize window based on these changes and make the window title fit
			resizeActiveWindowC(dw, dh);
			checkWindowTitle(activeWindow);
		});

		$(window).mouseup(function()
		{
			$(window).unbind("mousemove");
			resizingWindow = false;
		});
	}
	// If the window is being resized by a side
	else if (elem.attr("class").substring(0, 4) == "side")
	{
		// Determine what side was selected
		var pos = elem.attr("class").substring(5);

		if (pos == "top") resizePos = 0;
		else if (pos == "right") resizePos = 1;
		else if (pos == "bot") resizePos = 2;
		else if (pos == "left") resizePos = 3;
		else resizePos = -1;

		// Function for moving mouse/dragging side
		$(window).mousemove(function(e)
		{
			// Determine the change in mouse position
			var mx = e.clientX;
			var my = e.clientY;

			if (mx < 0) mx = 0;
			if (my < 0) my = 0;

			var dw = 0;
			var dh = 0;

			// Only determine change for the correct axis of movement
			if (resizePos == 1 || resizePos == 3) dw = mx - temp_mx;
			if (resizePos == 0 || resizePos == 2) dh = my - temp_my;

			temp_mx = mx;
			temp_my = my;

			// Resize window based on these changes and make the window title fit
			resizeActiveWindowS(dw, dh);
			checkWindowTitle(activeWindow);
		});

		$(window).mouseup(function()
		{
			$(window).unbind("mousemove");
			resizingWindow = false;
		});
	}
	else resizingWindow = false;
}

function resizeActiveWindowC(dw, dh)
{
	var win = $("#window" + activeWindow);

	// Negate dw and/or dh dependent on the corner
	if (resizePos == 0)
	{
		dw *= -1;
		dh *= -1;
	}
	else if (resizePos == 1) dh *= -1;
	else if (resizePos == 3) dw *= -1;

	// Determine the new window width/height
	var w = win.width() + dw;
	var h = win.height() + dh;

	// Determine minimum size
	var minw = 200;
	var minh = 200;

	if (win.children(".info_minwidth")) minw = win.children(".info_minwidth").html();
	if (win.children(".info_minheight")) minh = win.children(".info_minheight").html();

	// Don't let the window be smaller than its minimum size
	if (w < minw)
	{
		w = minw;
		dw = 0;
	}

	if (h < minh)
	{
		h = minh;
		dh = 0;
	}

	// Don't resize when the mouse is inside the window
	if (resizePos == 1 || resizePos == 2)
	{
		if (dw > 0 && temp_mx < win.offset().left + w) w -= dw;
	}

	if (resizePos == 2 || resizePos == 3)
	{
		if (dh > 0 && temp_my < win.offset().top + h) h -= dh;
	}

	if (resizePos == 0 || resizePos == 3)
	{
		if (dw > 0 && temp_mx > win.offset().left)
		{
			w -= dw
			dw = 0;
		}
	}

	if (resizePos == 0 || resizePos == 1)
	{
		if (dh > 0 && temp_my > win.offset().top)
		{
			h -= dh;
			dh = 0;
		}
	}

	// Set new window position/size
	if (resizePos == 0) win.css({
			"left":	win.offset().left - dw,
			"top": 	win.offset().top - dh
	});
	else if (resizePos == 1)
	{
		win.css("top", win.offset().top - dh);
	}
	else if (resizePos == 3) win.css("left", win.offset().left - dw);

	win.css({
		"width":	w,
		"height":	h
	});
}

function resizeActiveWindowS(dw, dh)
{
	var win = $("#window" + activeWindow);

	if (dw != 0)
	{
		// Negate dw if the side is left
		if (resizePos == 3) dw *= -1;

		// Determine new width and make sure it isn't smaller than 200
		var w = win.width() + dw;

		if (w < 200)
		{
			w = 200;
			dw = 0;
		}

		// Don't resize when the mouse is inside the window
		if (resizePos == 1 && dw > 0 && temp_mx < win.offset().left + w) w -= dw;
		else if (resizePos == 3 && dw > 0 && temp_mx > win.offset().left)
		{
			w -= dw
			dw = 0;
		}

		// Move window position if the side is left
		if (resizePos == 3) win.css("left", win.offset().left - dw);

		// Set new width
		win.css("width", w);
	}
	else if (dh != 0)
	{
		// Negate dh if the side is top
		if (resizePos == 0) dh *= -1;

		// Determine new height and make sure it isn't smaller than 200
		var h = win.height() + dh;

		if (h < 200)
		{
			h = 200;
			dh = 0;
		}

		// Don't resize when the mouse is inside the window
		if (resizePos == 2 && dh > 0 && temp_my < win.offset().top + h) h -= dh;
		else if (resizePos == 0 && dh > 0 && temp_my > win.offset().top)
		{
			h -= dh;
			dh = 0;
		}

		// Move the window if the side is top
		if (resizePos == 0) win.css("top", win.offset().top - dh);

		// Set the new height
		win.css("height", h);
	}
}

function checkWindowTitle(id_)
{
	// Get the window, bar, title container, and title
	var win = $("#window" + id_);
	var bar = win.children(".mid").children(".mid").children(".bar");
	var container = bar.children(".title");
	var title = win.children(".info_title").html();

	// Get width of the title container
	var w = container.width();

	// Shorten the title if the window is too small to fit it
	if (checkLength(title, 16) > w)
	{
		var i = title.length - 2;
		var newTitle = "";

		while (i > 3)
		{
			newTitle = title.substring(0, i) + "...";
			if (checkLength(newTitle, 16) < w) break;
			i--;
		}

		container.html(newTitle);
	}
	else container.html(title);
}

function handleGenericClick(e)
{
	var target = $(e.target);

	// Close the start menu if clicking anywhere besides the start button
	if (!target.is("#btn_start")) closeStart();
}

function pressStart()
{
	// Toggle the start menu being open/closed
	startPressed = !startPressed;

	if (startPressed) openStart();
	else closeStart();
}

function openStart()
{
	// Get start button and menu
	var btn = $("#btn_start");
	var menu = $("#menu_start");

	// Change the button to pressed
	btn.css("background-image", "url(\"./res/start/start_pressed.png\")");

	// Determine height of menu
	menu.css("height", ((menuOptions * 38) + (menuDividers * 2) + 6));

	// Set the menu position and make it visible
	menu.css({
		"display":	"block",
		"top":		(btn.offset().top - menu.height() + 4)
	});

	startPressed = true;
}

function closeStart()
{
	// Depress the start button and hide the menu
	$("#btn_start").css("background-image", "url(\"./res/start/start.png\")");
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

function loadProgram(name)
{
	// Create program div
	var programs = $("#programs");
	programs.append('<div id="program' + pid + '"></div>');

	// Get program info
	$.getJSON("./programs/" + name + "/info.json", function(data)
	{
		tempJSON = data;

		// Load code for it
		var program = programs.children("#program" + pid);
		$.getScript("./programs/" + data.name + "/code.js", function()
		{
			// Create window for this program
			createWindow(tempJSON.title, tempJSON.min_width, tempJSON.min_height, 0, 0);

			// Add hidden info to window
			var win = $("#window" + (id - 1));
			win.append('<div class="hidden info_pid">' + pid + '</div>');
			win.append('<div class="hidden info_minwidth">' + tempJSON.min_width + '</div>');
			win.append('<div class="hidden info_minheight">' + tempJSON.min_height + '</div>');

			// Call initialization function
			var func = "prg_" + tempJSON.name + "_init";
			window[func](pid, id - 1);

			// Increase PID value
			pid++;
		});
	});
}

function checkLength(txt, size)
{
	var div = $("#testLength");

	div.css("font-size", size);
	div.html(txt);

	return div.outerWidth() + 1;
}

function fadeIn()
{
	// Fade in
	var div = $("#fader");
	var opacity = div.css("opacity");

	if (opacity > 0)
	{
		div.css("opacity", opacity - .025);
		setTimeout(fadeIn, 25);
	}
	else div.css({
		"display":	"none",
		"z-index":	-1
	});
}