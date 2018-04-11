var port = 7879;
var mcastaddr = "230.120.120.120";
var host = "";
var dgram = require('dgram');
var os = require('os');
var ifaces = os.networkInterfaces();
var client = dgram.createSocket({ type: 'udp4', reuseAddr: true })
function search(callback) {
	client.on('message', function (message, remote) {   
		var parsed = JSON.parse(message);
		callback(parsed);
	});
	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0;
	  ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      return;
	    }
	    if (alias >= 1) {
	    } else {
	      if (ifname = "en0") {
	      	host = iface.address;
	      	client.bind(port, function () {
				client.addMembership(mcastaddr, host);
				var address = client.address();
				client.setBroadcast(true)
				client.setMulticastTTL(128); 
			});
	      }
	    }
	    ++alias;
	  });
	});
}
module.exports.search = search;