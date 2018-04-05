var lib = require("./lib.js")
var menu = require("./menu.js")
const net = require('net');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function main(ip) {
	var tiles = {};
	var world = [];
	var messages = [];
	var player = {};
	var token = "";
	var overlay = [];
	var client;
	process.stdin.on('keypress', function (chunk, key) {
	  if (key.name == "up" || key.name == "down" || key.name == "left" || key.name == "right") {
	  	var send_json = {"type":"playermove","token":token,"data":key.name};
	  	client.write(JSON.stringify(send_json)+";");
	  } else if (key.name == "c") {
	  	lib.reset();
	  	process.exit();
	  }
	});
function overlaygen(input) {
	//populate overlay with empty arrays on the y axis
	for (var i = 0; i < world.length; i++) {
		overlay[i] = [];
	}
	for (var k in input) {
	    if (input.hasOwnProperty(k)) {
	    	if (k != token) {
	    		overlay[input[k].y] = [];
	    		overlay[input[k].y][input[k].x] = input[k].renderable;
	    	}
	    }
	}
}
function healthrender(amt) {
	var ren = "";
	for (var i = 0; i < amt; i++) {
		ren += "█";
	}
	return ren;
}
function render(callback) {
		lib.reset();
		var i, j;
		for ( i = 0; i < world.length; i++ ) {
	      for ( j = 0; j < world[0].length; j++ ) {
	      	if (player.x == j && player.y == i) {
	      		lib.printf("\x1b[31m@\x1b[0m");
	      	} else if (overlay.length > 0) {
		      		if (overlay[i][j] != undefined || overlay[i][j] != null) {
		      			lib.printf(overlay[i][j]);
		      		} else if (tiles[world[i][j]].is_tile == true) {
	      			lib.printf(tiles[world[i][j]].colour+world[i][j]+"\x1b[0m");
	      		} else {
		      			lib.printf(world[i][j]);
		      		}
	      	} else if (tiles[world[i][j]].is_tile == true) {
	      			lib.printf(tiles[world[i][j]].colour+world[i][j]+"\x1b[0m");
	      	} 
	      }
	      lib.printf("\n");
	   	}
	   	lib.printf("Health\n");
	   	lib.printf("\x1b[31m");
	   	if (player.health <= 0) {
	   		lib.printf(healthrender(0));
	   		lib.reset();
	   		lib.printf("You Died!\n")
	  		process.exit();
	   	} else if (player.health < 10) {
	   		lib.printf(healthrender(1));
	   	} else if (player.health < 20) {
	   		lib.printf(healthrender(2));
	   	} else if (player.health < 30) {
	   		lib.printf(healthrender(3));
	   	} else if (player.health < 40) {
	   		lib.printf(healthrender(4));
	   	} else if (player.health < 50) {
	   		lib.printf(healthrender(5));
	   	} else if (player.health < 60) {
	   		lib.printf(healthrender(6));
	   	} else if (player.health < 70) {
	   		lib.printf(healthrender(7));
	   	} else if (player.health < 80) {
	   		lib.printf(healthrender(8));
	   	} else if (player.health < 90) {
	   		lib.printf(healthrender(9));
	   	} else if (player.health <= 100) {
	   		lib.printf(healthrender(10));
	   	}
	   	lib.printf("\x1b[0m\n")
	   	for (var i = 0; i < messages.length; i++) {
	   		lib.printf(messages[i])
	   	}
	   	messages = [];
	   	if (callback) {
	   		callback();
	   	}
	}
	client = net.createConnection({ port: 7878, host:ip }, () => {
	  var handshake_json = {"type":"handshake"}
	  client.write(JSON.stringify(handshake_json)+";");
	});
	client.on('data', (data) => {
		var sp = data.toString()
		sp = sp.split(";")
		if (sp[1] == '') {
			sp.splice(1, 1);
		}
			for (var i = 0; i < sp.length; i++) {
				var jsondata = "";
				if (sp[i] != '') {
					jsondata = JSON.parse(sp[i]);
				} else {
					break;
				}
				if (jsondata.type == "handshake") {
					token = jsondata.token;
					//get the world
					var getworld_json = {"type":"getworld","token":token};
			  		client.write(JSON.stringify(getworld_json)+";");
				} else if (jsondata.type == "world") {
					//set the world
					world = jsondata.data;
					//get tiles
					var gettiles_json = {"type":"gettiles","token":token};
			  		client.write(JSON.stringify(gettiles_json)+";");
				} else if (jsondata.type == "tiles") {
					//set tiles
					tiles = jsondata.data;
					//get initplayer
					var getinitplayer_json = {"type":"getinitplayer","token":token};
			  		client.write(JSON.stringify(getinitplayer_json)+";");
				} else if (jsondata.type == "player") {
					//set player
					player = jsondata.data;
					//render
					render();
				} else if (jsondata.type == "overlaydata") {
					//set player
					overlaygen(jsondata.data)
					//render
					render();
			}
		}
	});
	client.on('end', () => {
	  console.log('disconnected from server');
	});
}
menu.menu(main, readline);