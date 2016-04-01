var prg_test_program_pid = null;
var prg_test_program_wid = null;

var prg_test_program_win = null;
var prg_test_program_container = null;

function prg_test_program_init(pid, wid)
{
	prg_test_program_pid = pid;
	prg_test_program_wid = wid;

	prg_test_program_win = $("#window" + wid);
	prg_test_program_container = prg_test_program_win.children(".mid").children(".mid").children(".container");

	prg_test_program_container.html("This is a test window.");
}