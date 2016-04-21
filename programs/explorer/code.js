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

		prg_explorer_loadPath("/");
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
		prg_explorer_addIcon("C:/", "disk", "(C:)");
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

					// Reset the window and change the title
					prg_explorer_div.empty();
					prg_explorer_changeTitle(prg_explorer_curPath);
					prg_explorer_icon_id = 0;

					if (prg_explorer_curPath.charAt(prg_explorer_curPath.length - 1) != '/')
						prg_explorer_curPath += '/';

					// Get contents of directory
					$.get("checkDirectory.php?path=" + directPath, function(data)
					{
						var paths = data.split("*");

						$.each(paths, function(index, val)
						{
							if (val.charAt(0) == '?')
								prg_explorer_addIcon(prg_explorer_curPath + val.substring(1), "directory", val.substring(1));
							else if (val.trim() !== "")
								prg_explorer_addIcon(prg_explorer_curPath + val, "file", val);
						});
					});
				}
				// Handle file loading
				else
				{

				}
			});
		}
	}
}

function prg_explorer_addIcon(path, type, label)
{
	prg_explorer_div.append(
		'<div id="prg_explorer_icon' + prg_explorer_icon_id + '" class="icon"><div class="icon ' + type + '"></div><div class="label">' + label + '</div></div>'
	);

	var icon = prg_explorer_div.children("#prg_explorer_icon" + prg_explorer_icon_id);
	

	icon.click(function()
	{
		$(".prg_explorer.mid").children(".mid").children(".icon").css("border-color", "rgba(0, 0, 0, 0)");

		$(this).css("border-color", "gray");
	});

	icon.dblclick(function()
	{
		prg_explorer_loadPath(path);
	});

	prg_explorer_icon_id++;
}