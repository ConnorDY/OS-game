var prg_explorer_pid = null;
var prg_explorer_wid = null;

var prg_explorer_win = null;
var prg_explorer_container = null;

var prg_explorer_div = null;

var prg_explorer_curPath = "";
var prg_explorer_tempPath = "";

var prg_explorer_icon_id = 0;

function prg_explorer_init(pid, wid)
{
	// Store info
	prg_explorer_pid = pid;
	prg_explorer_wid = wid;

	prg_explorer_win = $("#window" + wid);
	prg_explorer_container = prg_explorer_win.children(".mid").children(".mid").children(".container");

	// Load Window HTML
	$.get("./programs/explorer/window.html", function(response)
	{
		prg_explorer_container.html(response);

		prg_explorer_div = prg_explorer_container.children(".mid").children(".mid");

		prg_explorer_loadPath("C:/Documents/");
	});
}

function prg_explorer_changeTitle(path)
{
	var title = path;
	if (path === "/") title = "My Computer";

	setWindowTitle(prg_explorer_wid, title);
}

function prg_explorer_loadPath(path)
{
	if (path === "/")
	{
		// Reset the window and change the title
		prg_explorer_div.empty();
		prg_explorer_changeTitle(path);
		prg_explorer_icon_id = 0;

		// Add "My Computer" icons
		prg_explorer_addIcon("A:", "floppy", "3½ Floppy (A:)");
		prg_explorer_addIcon("E:", "disc", "(E:)");
		prg_explorer_addIcon("C:", "disk", "(C:)");
		prg_explorer_addIcon("/ctrl", "ctrlpanel", "Control Panel");
	}
	else if (path === "A:")
	{

	}
	else if (path === "E:")
	{

	}
	else if (path === "/ctrl")
	{

	}
	else
	{
		if (path.substring(0, 2) === "C:")
		{
			prg_explorer_tempPath = path;	

			$.get("isDirectory.php?path=" + path.substring(2), function(data)
			{
				// Handle directory loading
				if (data === '1')
				{
					// Set new path
					prg_explorer_curPath = prg_explorer_tempPath;
					var directPath = prg_explorer_curPath.substring(2);

					// Remove trailing forward slash if necessary
					if (prg_explorer_curPath.charAt(prg_explorer_curPath.length - 1) != '/')
						prg_explorer_curPath += '/';

					// Reset the window and change the title
					prg_explorer_div.empty();
					prg_explorer_changeTitle(prg_explorer_curPath);
					prg_explorer_icon_id = 0;

					// Get contents of directory
					$.get("checkDirectory.php?path=" + directPath, function(data)
					{
						var paths = data.split("*");

						$.each(paths, function(index, val)
						{
							if (val.charAt(0) == '?') prg_explorer_addIcon(prg_explorer_curPath + val.substring(1), "directory", val.substring(1));
							else if (val.trim() !== "")
							{
								// Get extension
								var ext = val.replace(/^.*\./, '');

								var type = "file";
								if (ext === "txt") type = "txt";
								
								prg_explorer_addIcon(prg_explorer_curPath + val, type, val);
							}
						});
					});
				}
				// Handle file loading
				else
				{
					var path = prg_explorer_tempPath;

					// Get extension
					var ext = path.replace(/^.*\./, '');

					var type = "file";
					if (ext === "txt")
					{

					}
					else if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "bmp")
					{
						if (!windowExists("photoview")) addProgram("photoview");

						setTimeout(function()
						{
							prg_photoview_loadPhoto(prg_explorer_tempPath.substring(3));
						}, 222);
					}
				}
			});
		}
	}
}

function prg_explorer_goUpDirectory()
{
	var newPath = prg_explorer_curPath;

	if (newPath === "C:/") newPath = "/";
	else
	{
		if (newPath.charAt(newPath.length - 1) == '/')
			newPath = newPath.substring(0, newPath.length - 1);

		newPath = newPath.substring(0, newPath.lastIndexOf('/') + 1);
	}

	prg_explorer_loadPath(newPath);

	// Close dropdown menus
	$(".filebar").children(".menus").children(".menu_entry").each(function()
	{
		$(this).removeClass("active");

		$(this).children(".dropdown").css("display", "none");
	});
}

function prg_explorer_addIcon(path, type, label)
{
	prg_explorer_div.append(
		'<div id="prg_explorer_icon' + prg_explorer_icon_id + '" class="icon"><div class="icon ' + type + '"></div><div class="label">' + label + '</div></div>'
	);

	var icon = prg_explorer_div.children("#prg_explorer_icon" + prg_explorer_icon_id);
	
	icon.click(function()
	{
		setTimeout(function(elem)
		{
			elem.css("border-color", "rgba(0, 0, 0, .5)");
		}, 10, $(this));
	});

	icon.dblclick(function()
	{
		prg_explorer_loadPath(path);
	});

	prg_explorer_icon_id++;
}

function prg_explorer_clickMenuItem(menu)
{
	var menu_div = prg_explorer_container.children(".filebar").children(".menus").children("#menu_" + menu);

	menu_div.addClass("active");

	menu_div.children(".dropdown").css("display", "block");
}