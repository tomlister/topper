var lib = require("./lib.js")
var ui = require("./ui.js")
var broadcast_recv = require("./broadcast_recv.js")

var lock = false;
var selected = "servers";
var joinselected = "box";
var serveruistack = ["exit"];
var serveruipos = 0;
var menuname = "main";
var ipbuff = "";
var searching = false;
var servers = [];
var searchloop;
function arraycb() {
	return servers;
}
function searcher_add(add) {
	var exists = false;
	for (var i = 0; i < servers.length; i++) {
		if (servers[i].ip == add.ip) {
			exists = true;
			break;
		}
	}
	if (exists == false) {
		servers.push(add);
	}
}
function searcher() {
	if (searching == false) {
		searching = true;
		broadcast_recv.search(searcher_add);
	}
	searchloop = setInterval(function() {
			if (menuname == "servers") {
				for (var i = 0; i < servers.length; i++) {
					var exists = false;
					for (var x = 0; x < serveruistack.length; x++) {
						if (serveruistack[x].ip == servers[i].ip) {
							exists = true;
							break;
						}
					}
					if (exists == false) {
						serveruistack.unshift(servers[i]);
					}
				}
				if (serveruistack[serveruipos] == "exit") {
					serveruipos = serveruistack.length-1;
				}
				serversmenu();
			} else {
				clearInterval(searchloop)	
			}
		}, 1000)
}

function rendermenu(){
	lib.reset();
	ui.title("TOPPER", 3);
	if (selected == "servers") {
		lib.printf("\x1b[31m");
	}
	ui.button("SERVERS");
	lib.printf("\x1b[0m");
	if (selected == "join") {
		lib.printf("\x1b[31m");
	}
	ui.button("JOIN", 5);
	lib.printf("\x1b[0m");
	if (selected == "exit") {
		lib.printf("\x1b[31m");
	}
	ui.button("EXIT", 5);
	lib.printf("\x1b[0m");
}
function joinmenu() {
	lib.reset();
	ui.title("JOIN");
	ui.text("IP ADDRESS");
	lib.printf("\n");
	if (joinselected == "box") {
		lib.printf("\x1b[31m");
	}
	ui.input(ipbuff);
	lib.printf("\x1b[0m");
	if (joinselected == "exit") {
		lib.printf("\x1b[31m");
	}
	ui.button("BACK");
	lib.printf("\x1b[0m");
}
function serversmenu() {
	lib.reset();
	ui.title("SERVERS");
	for (var i = 0; i < servers.length; i++) {
		if (serveruistack[serveruipos] == servers[i]) {
			lib.printf("\x1b[31m");
		}
		ui.button(servers[i].message+" on "+servers[i].ip)
		lib.printf("\x1b[0m");
	}
	if (serveruistack[serveruipos] == "exit") {
		lib.printf("\x1b[31m");
	}
	ui.button("BACK");
	lib.printf("\x1b[0m");
}
function menu(callback, readline) {
	rendermenu();
	process.stdin.on('keypress', function (chunk, key) {
		if (lock == false) {
			if (menuname == "servers") {
				if (key.name == "up") {
					if (serveruipos != 0) {
						serveruipos -= 1;
					}
				  	serversmenu();
				} else if (key.name == "down") {
				  	if (serveruipos != serveruistack.length-1) {
						serveruipos += 1;
					}
			  		serversmenu();
				} else if (key.name = "return") {
					if (serveruistack[serveruipos] == "exit") {
						menuname = "main";
						rendermenu();
					} else if (serveruistack[serveruipos].ip) {
						lock = true;
						callback(ipbuff);
						clearInterval(searchloop);
					}
				}
			} else if (menuname == "main") {
				if (key.name == "up") {
					if (selected == "exit") {
				  		selected = "join";
				  	} else if (selected == "join") {
				  		selected = "servers";
				  	}
				  	rendermenu();
				} else if (key.name == "down") {
				  	if (selected == "join") {
				  		selected = "exit";
				  	} else if (selected == "servers") {
				  		selected = "join";
				  	}
			  		rendermenu();
				} else if (key.name == "return") {
				  	if (selected == "join") {
				  		menuname = "join";
				  		joinmenu();
				  	} else if (selected == "exit") {
				  		lib.reset();
				  		process.exit();
				  	} else if (selected == "servers") {
				  		menuname = "servers";
				  		searcher();
				  		serversmenu();
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
					} else if (key.name == "return") {
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