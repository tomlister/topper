var lib = require("./lib.js")
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function main() {
	var tiles = {
		"~": {
			colour:"\x1b[34m",
			type:"water",
			is_tile:true
		}, "#": {
			colour:"",
			type:"wall",
			is_tile:true
		}, ".": {
			colour:"\x1b[90m",
			type:"stone",
			is_tile:true
		}, " ": {
			colour:"",
			type:"air",
			is_tile:true
		}
	}
	var world = [
		["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
		["#", ".", ".", ".", ".", ".", ".", "~", "~", "~", "~", "~", "~", "~", "#"],
		["#", ".", ".", ".", ".", ".", ".", "#", "#", "#", "#", "#", "#", "~", "#"],
		["#", ".", ".", ".", ".", ".", ".", "#", " ", " ", " ", " ", "#", "~", "#"],
		["#", ".", ".", ".", ".", ".", ".", "#", " ", " ", " ", " ", "#", "~", "#"],
		["#", ".", ".", ".", ".", ".", ".", "#", " ", " ", " ", " ", "#", "~", "#"],
		["#", ".", ".", ".", ".", ".", ".", "#", " ", " ", " ", " ", "#", "~", "#"],
		["#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", "#", "#", "#"],
	];
	var messages = [];
	var player = {
		x: 5,
		y: 5,
		wet: false,
		drying: false,
		setWet: function (status) {
			wet = status;
			messages.push("Oh no I'm wet!\n");
		},
		dryTimer: function () {
			if (drying == false) {
				var time = 10;
				var timer = setInterval(function(){
					time -= 0.5;
					render(lib.printf("Time to dry out "+time+"s\n"));
				  if(time <= 0) {
				  	wet = false;
				  	drying = false;
				  	clearInterval(timer);
				  }
				},500);
			}
		}
	}
	function collison(attemptx, attempty) {
		if (world[attempty][attemptx] == "#") {
			//make bell sound
			lib.printf("\007");
			return true;
		} else {
			if (tiles[world[attempty][attemptx]].type == "water") {
				player.setWet(true)
			} else if (tiles[world[attempty][attemptx]].type == "stone") {
				if (player.wet == true) {
					player.setWet(false)
				}
			}
			return false;
		}
	}

	process.stdin.on('keypress', function (chunk, key) {
	  if (key.name == "up") {
	  	if (!collison(player.x, player.y - 1)) {
	  		player.y -= 1;
	  		render()
	  	}
	  } else if (key.name == "down") {
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
	  } else if (key.name == "c") {
	  	lib.reset();
	  	process.exit();
	  }
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
	render();
}
main()