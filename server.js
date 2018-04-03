const net = require('net');
var players = {};
var clients = [];
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
	}, "●": {
		colour:"",
		type:"stone",
		is_tile:true
	}
}
var world = [
	[" ","#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "~", "~", "~", "~", "~", "~", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", "#", "#", "#", "#", "#", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", " ", "●", " ", " ", "#", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", " ", "●", " ", " ", "#", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", " ", "●", " ", " ", "#", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", " ", "●", " ", " ", "#", "~", "#", " ", "#"],
	["#","#", "#", "#", "#", "#", "#", "#", "#", " ", "●", " ", " ", "#", "~", "#", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", "●", " ", " ", "~", "●", "~", " ", "#"],
	["#"," ", "●", "●", "●", "●", "●", "●","●", "●", "●", " ", " ", " ", "●", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", "●", " ", " ", " ", "●", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", "●", " ", " ", " ", "●", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", "●", "●", "●", "●", "●", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
	["#"," ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
	["#","#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
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
		return false;
	}
}

function overlaydatagen(jsondata) {
	var overlay_json = {"type":"overlaydata","data":players};
	clients.forEach(function (client) {
  		client.write(JSON.stringify(overlay_json)+";");
	});
}

const server = net.createServer((c) => {
  console.log('Client connected');
  clients.push(c);
  c.on('end', () => {
    console.log('Client disconnected');
  });
  c.on('data', (data) => {
  	var sp = data.toString()
	sp = sp.split(";")
	if (sp[1] == '') {
		sp.splice(1, 1);
	}
	for (var i = 0; i < sp.length; i++) {
		var jsondata = "";
		if (sp[i] != '') {
			jsondata = JSON.parse(sp[i]);
		}
	  	if (jsondata.type == "handshake") {
	  		var gid = genid();
	  		var connect_json = {"type":"handshake", "token":gid};
	  		players[gid] = {"valid":true};
	  		c.write(JSON.stringify(connect_json)+";");
	  	} else if (players[jsondata.token]) {
	  		if (jsondata.type == "playermove") {
		  		if (jsondata.data == "up") {
		  			if (!collision(players[jsondata.token].x, players[jsondata.token].y - 1)) {
						players[jsondata.token].y -= 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
				} else if (jsondata.data == "down") {
					if (!collision(players[jsondata.token].x, players[jsondata.token].y + 1)) {
						players[jsondata.token].y += 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
	  			} else if (jsondata.data == "left") {
					if (!collision(players[jsondata.token].x - 1, players[jsondata.token].y)) {
						players[jsondata.token].x -= 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
	  			} else if (jsondata.data == "right") {
					if (!collision(players[jsondata.token].x + 1, players[jsondata.token].y)) {
						players[jsondata.token].x += 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
	  			} 
	  			overlaydatagen();
	  		} else if (jsondata.type == "getworld") {
	  			var world_json = {"type":"world","data":world};
	  			c.write(JSON.stringify(world_json)+";");
	  		} else if (jsondata.type == "gettiles") {
	  			var tiles_json = {"type":"tiles","data":tiles};
	  			c.write(JSON.stringify(tiles_json)+";");
	  		} else if (jsondata.type == "getinitplayer") {
	  			players[jsondata.token] = {
	  				"x":5, 
	  				"y":5, 
	  				"wet": false, 
	  				"drying": false,
	  				"health": 100,
	  				"renderable": "@",
					setWet: function (status) {
						wet = status;
						//messages.push("Oh no I'm wet!\n");
					}
				}
	  			var player_json = {"type":"player","data":players[jsondata.token]};
	  			c.write(JSON.stringify(player_json)+";");
	  			overlaydatagen();
	  		} else if (jsondata.type == "getoverlay") {
				var overlaydata = players;
				for (var k in overlaydata) {
					if (overlaydata.hasOwnProperty(k)) {
				        if (k == jsondata.token) {
				        	delete overlaydata[k];
				        }
				    }
				}
	  			var overlay_json = {"type":"overlaydata","data":overlaydata};
	  			c.write(JSON.stringify(overlay_json)+";");
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