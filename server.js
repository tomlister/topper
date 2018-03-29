const net = require('net');
var players = {};
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

function genid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function collision(attemptx, attempty) {
	if (world[attempty][attemptx] == "#") {
		return true;
	} else {
		/*if (tiles[world[attempty][attemptx]].type == "water") {
			players[].setWet(true)
		} else if (tiles[world[attempty][attemptx]].type == "stone") {
			if (player.wet == true) {
				player.setWet(false)
			}
		}*/
		return false;
	}
}
const server = net.createServer((c) => {
  console.log('Client connected');
  c.on('end', () => {
    console.log('Client disconnected');
  });
  c.on('data', (data) => {
  	var jsondata = JSON.parse(data);
  	if (jsondata.type == "handshake") {
  		var gid = genid();
  		var connect_json = {"type":"handshake", "token":gid};
  		players[gid] = {"valid":true};
  		c.write(JSON.stringify(connect_json));
  	} else if (players[jsondata.token].valid == true) {
  		console.log("got req");
  		if (jsondata.type == "getworld") {
  			var world_json = {"type":"world","data":world};
  			c.write(JSON.stringify(world_json));
  		} else if (jsondata.type == "gettiles") {
  			var tiles_json = {"type":"tiles","data":tiles};
  			c.write(JSON.stringify(tiles_json));
  		} else if (jsondata.type == "getinitplayer") {
  			players[jsondata.token] = {
  				"x":5, 
  				"y":5, 
  				"wet": false, 
  				"drying": false,
				setWet: function (status) {
					wet = status;
					//messages.push("Oh no I'm wet!\n");
				}
			}
  			var player_json = {"type":"player","data":players[jsondata.token]};
  			c.write(JSON.stringify(player_json));
  		} else if (jsondata.type == "playerup") {
  			console.log("got playerup");
  			if (!collision(players[jsondata.token].x, players[jsondata.token].y - 1)) {
				players[jsondata.token].y -= 1;
				var player_json = {"type":"player","data":players[jsondata.token]};
  				c.write(JSON.stringify(player_json));
			}
  		}
  	}
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(7878, () => {
  console.log('Server Listening...');
});