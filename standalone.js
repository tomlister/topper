//import lib so we can access awesome functions like printf() and reset()
var lib = require("./lib.js")
//stdin/readline init
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

//the main function where almost all of the game logic is stored.
function main() {
	//tiles object stores information about tiles inside the world.
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
	//world array stores the position of tiles.
	//x & y start at the top left corner.
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
	//messages stores messages that can be pushed by player's functions
	var messages = [];
	//player stores the player information, eg: world location, status, and various functions.
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
	//collision system
	function collision(attemptx, attempty) {
		//check if attempted location is a barrier/wall
		if (world[attempty][attemptx] == "#") {
			//make bell sound
			lib.printf("\007");
			//return true if collision has happened
			return true;
		} else {
			//else check if water or stone
			if (tiles[world[attempty][attemptx]].type == "water") {
				player.setWet(true)
			} else if (tiles[world[attempty][attemptx]].type == "stone") {
				if (player.wet == true) {
					player.setWet(false)
				}
			}
			//return false if no collision has happened
			return false;
		}
	}
	//read keypresses from stdin
	process.stdin.on('keypress', function (chunk, key) {
	  if (key.name == "up") {
	  	//modify player position
	  	if (!collision(player.x, player.y - 1)) {
	  		player.y -= 1;
	  		render()
	  	}
	  } else if (key.name == "down") {
	  	//ditto
	  	if (!collision(player.x, player.y + 1)) {
	  		player.y += 1;
	  		render()
	  	}
	  } else if (key.name == "left") {
	  	//ditto
	  	if (!collision(player.x - 1, player.y)) {
	  		player.x -= 1;
	  		render()
	  	}
	  } else if (key.name == "right") {
	  	//ditto
	  	if (!collision(player.x + 1, player.y)) {
	  		player.x += 1;
	  		render()
	  	}
	  } else if (key.name == "c") {
	  	//if c is pressed exit the game.
	  	lib.reset();
	  	process.exit();
	  }
	});
	//render the world + player
	function render(callback) {
		lib.reset();
		var i, j;
		//scan through the 2d array
		for ( i = 0; i < world.length; i++ ) {
	      for ( j = 0; j < world[0].length; j++ ) {
	      	//check if the player if at this location
	      	if (player.x == j && player.y == i) {
	      		//print the player character
	      		lib.printf("\x1b[31m@\x1b[0m");
	      	} else {
	      		//check if tile is in tile object
	      		if (tiles[world[i][j]].is_tile == true) {
	      			//print tile with colour
	      			lib.printf(tiles[world[i][j]].colour+world[i][j]+"\x1b[0m");
	      		} else {
	      			lib.printf(world[i][j]);
	      		}
	      	}
	      }
	      //print newline before jumping to the next y pos.
	      lib.printf("\n");
	   	}
	   	//go through message array
	   	for (var i = 0; i < messages.length; i++) {
	   		//print message
	   		lib.printf(messages[i])
	   	}
	   	//clear messages
	   	messages = [];
	   	//check if render function has a callback attached
	   	if (callback) {
	   		//callback
	   		callback();
	   	}
	}
	//initial render
	render();
}
//run the main function
main()