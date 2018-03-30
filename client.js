var lib = require("./lib.js")
const net = require('net');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function main() {
	var tiles = {};
	var world = [];
	var messages = [];
	var player = {};
	var token = "";
	var client;
	process.stdin.on('keypress', function (chunk, key) {
	  if (key.name == "up" || key.name == "down" || key.name == "left" || key.name == "right") {
	  	var send_json = {"type":"playermove","token":token,"data":key.name};
	  	client.write(JSON.stringify(send_json));
	  } else if (key.name == "c") {
	  	lib.reset();
	  	process.exit();
	  } /*else if (key.name == "down") {
	  	if (!collison(player.x, player.y + 1)) {
	  		player.y += 1;
	  		render()
	  	}
	  } else if (key.name == "left") {
	  	if (!collison(player.x - 1, player.y)) {
	  		player.x -= 1;
	  		render()
	  	}
	  } else if (key.name == "right") {
	  	if (!collison(player.x + 1, player.y)) {
	  		player.x += 1;
	  		render()
	  	}
	  }*/
	});
function render(callback) {
		lib.reset();
		var i, j;
		for ( i = 0; i < world.length; i++ ) {
	      for ( j = 0; j < world[0].length; j++ ) {
	      	if (player.x == j && player.y == i) {
	      		lib.printf("\x1b[31m@\x1b[0m");
	      	} else {
	      		if (tiles[world[i][j]].is_tile == true) {
	      			lib.printf(tiles[world[i][j]].colour+world[i][j]+"\x1b[0m");
	      		} else {
	      			lib.printf(world[i][j]);
	      		}
	      	}
	      }
	      lib.printf("\n");
	   	}
	   	for (var i = 0; i < messages.length; i++) {
	   		lib.printf(messages[i])
	   	}
	   	messages = [];
	   	if (callback) {
	   		callback();
	   	}
	}
	client = net.createConnection({ port: 7878 }, () => {
	  var handshake_json = {"type":"handshake"}
	  client.write(JSON.stringify(handshake_json));
	});
	client.on('data', (data) => {
		var jsondata = JSON.parse(data);
		if (jsondata.type == "handshake") {
			token = jsondata.token;
			//get the world
			var getworld_json = {"type":"getworld","token":token};
	  		client.write(JSON.stringify(getworld_json));
		} else if (jsondata.type == "world") {
			//set the world
			world = jsondata.data;
			//get tiles
			var gettiles_json = {"type":"gettiles","token":token};
	  		client.write(JSON.stringify(gettiles_json));
		} else if (jsondata.type == "tiles") {
			//set tiles
			tiles = jsondata.data;
			//get initplayer
			var getinitplayer_json = {"type":"getinitplayer","token":token};
	  		client.write(JSON.stringify(getinitplayer_json));
		} else if (jsondata.type == "player") {
			//set player
			player = jsondata.data;
			//render
			render();
		}
	});
	client.on('end', () => {
	  console.log('disconnected from server');
	});
}
main();