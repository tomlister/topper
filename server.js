const net = require('net');
var lib = require("./libs/lib.js")

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
	}, "^": {
		colour:"",
		type:"spike",
		damage:10,
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
	[" ","#", ".", ".", ".", ".", ".", ".", "#", "^", "^", "^", " ", "#", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", "^", "^", "^", " ", "#", "~", "#", " ", "#"],
	[" ","#", ".", ".", ".", ".", ".", ".", "#", "^", "●", "^", " ", "#", "~", "#", " ", "#"],
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

function collision(attemptx, attempty, token) {
	if (world[attempty][attemptx] == "#") {
		return true;
	} else if (tiles[world[attempty][attemptx]]) {
		if (tiles[world[attempty][attemptx]].damage) {
			players[token].health -= tiles[world[attempty][attemptx]].damage;
		}
		return false;
	} else {
		return false;
	}
}

function overlaydatagen(jsondata) {
	var overlay_json = {"type":"overlaydata","data":players};
	for (var client in clients) {
    	if (clients.hasOwnProperty(client)) {
        	clients[client].write(JSON.stringify(overlay_json)+";");
    	}
	}
}

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Bytes';
   var k = 1024,
       dm = decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function memoryrender() {
	var usage = process.memoryUsage();
	var heapPercentage = (usage.heapUsed / usage.heapTotal) * 100;
	lib.printf("Using "+Math.round(heapPercentage)+"% ("+formatBytes(usage.heapUsed)+") of allocated memory.\n");
}

function stats() {
	console.log('--Topper Server--');
	memoryrender();
	setInterval(function() {
		lib.reset();
		console.log('--Topper Server--');
		memoryrender();
	}, 10000)
}

const server = net.createServer((c) => {
  var ac_tok = "";
  c.on('end', () => {
  	delete clients[ac_tok];
  	delete players[ac_tok];
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
	  		ac_tok = gid;
	  		clients[gid] = c;
	  		c.write(JSON.stringify(connect_json)+";");
	  	} else if (players[jsondata.token]) {
	  		if (jsondata.type == "playermove") {
		  		if (jsondata.data == "up") {
		  			if (!collision(players[jsondata.token].x, players[jsondata.token].y - 1, jsondata.token)) {
						players[jsondata.token].y -= 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
				} else if (jsondata.data == "down") {
					if (!collision(players[jsondata.token].x, players[jsondata.token].y + 1, jsondata.token)) {
						players[jsondata.token].y += 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
	  			} else if (jsondata.data == "left") {
					if (!collision(players[jsondata.token].x - 1, players[jsondata.token].y, jsondata.token)) {
						players[jsondata.token].x -= 1;
						var player_json = {"type":"player","data":players[jsondata.token]};
		  				c.write(JSON.stringify(player_json)+";");
					}
	  			} else if (jsondata.data == "right") {
					if (!collision(players[jsondata.token].x + 1, players[jsondata.token].y, jsondata.token)) {
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
	stats();
});