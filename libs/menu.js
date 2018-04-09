var lib = require("./lib.js")

var lock = false;
var selected = "join";
var joinselected = "box";
var menuname = "main";
var ipbuff = "";
function rendermenu(){
	lib.reset();
	lib.printl("▄", 10);
	lib.printf("\n");
	lib.printf("█ TOPPER █");
	lib.printf("\n");
	lib.printl("▀", 10);
	lib.printf("\n");
	if (selected == "join") {
		lib.printf("\x1b[31m");
	}
	lib.printl("▁", 10);
	lib.printf("\n");
	lib.printf("█  JOIN  █");
	lib.printf("\n");
	lib.printl("▔", 10);
	lib.printf("\x1b[0m\n");
	if (selected == "exit") {
		lib.printf("\x1b[31m");
	}
	lib.printl("▁", 10);
	lib.printf("\n");
	lib.printf("█  EXIT  █");
	lib.printf("\n");
	lib.printl("▔", 10);
	lib.printf("\x1b[0m\n");
}
function joinmenu() {
	lib.reset();
	lib.printl("▄", 10);
	lib.printf("\n");
	lib.printf("█  JOIN  █");
	lib.printf("\n");
	lib.printl("▀", 10);
	lib.printf("\n");
	lib.printf("IP ADDRESS");
	lib.printf("\n");
	if (joinselected == "box") {
		lib.printf("\x1b[31m");
	}
	lib.printl("▁", 17);
	lib.printf("\n");
	if (ipbuff == '') {
		lib.printf("█");
		lib.printl(" ", 15);
		lib.printf("█");
	} else {
		lib.printf("█"+ipbuff);
		lib.printl(" ", 15 - ipbuff.length);
		lib.printf("█");
	}
	lib.printf("\n");
	lib.printl("▔", 17);
	lib.printf("\x1b[0m\n");
	if (joinselected == "exit") {
		lib.printf("\x1b[31m");
	}
	lib.printl("▁", 10);
	lib.printf("\n");
	lib.printf("█  EXIT  █");
	lib.printf("\n");
	lib.printl("▔", 10);
	lib.printf("\x1b[0m\n");
}
function menu(callback, readline) {
	rendermenu();
	process.stdin.on('keypress', function (chunk, key) {
		if (lock == false) {
			if (menuname == "main") {
				if (key.name == "up") {
					if (selected == "exit") {
				  		selected = "join";
				  	}
				  	rendermenu();
				} else if (key.name == "down") {
				  	if (selected == "join") {
				  		selected = "exit";
				  	}
			  		rendermenu();
				} else if (key.name == "return") {
				  	if (selected == "join") {
				  		menuname = "join";
				  		joinmenu();
				  	} else if (selected == "exit") {
				  		lib.reset();
				  		process.exit();
				  	}
			  	}
			} else if (menuname == "join") {
				if (key.name == "up") {
					if (joinselected == "exit") {
				  		joinselected = "box";
				  	}
				  	joinmenu();
				} else if (key.name == "down") {
				  	if (joinselected == "box") {
				  		joinselected = "exit";
				  	}
			  		joinmenu();
				}
				if (joinselected == "box") {
					if (key.name == 1 || key.name == 2 || key.name == 3 || key.name == 4 || key.name == 5 || key.name == 6 || key.name == 7 || key.name == 8 || key.name == 9 || key.name == 0 || key.sequence == ".") {
						if (ipbuff.length != 15) {
							if (key.sequence == ".") {
								ipbuff += key.sequence;
							} else {
								ipbuff += key.name;
							}
							joinmenu();
						}
					} else if (key.name == "backspace") {
						ipbuff = ipbuff.slice(0, -1)
						joinmenu();
					}else if (key.name == "return") {
						lock = true;
						callback(ipbuff);
				  	}
				} else if (joinselected == "exit") {
					if (key.name == "return") {
						menuname = "main";
						rendermenu();
				  	}
				}
			}
		}
	});
}
module.exports.menu = menu;