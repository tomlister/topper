var port = 7879;
var mcastaddr = "230.120.120.120";
var data = {ip: "", message:"Topper Server"}
var dgram = require('dgram');
var os = require('os');
var ifaces = os.networkInterfaces();
var server = dgram.createSocket({ type: 'udp4', reuseAddr: true }); 
server.bind(port, function(){
    server.setBroadcast(true);
    server.setMulticastTTL(128);
    server.addMembership(mcastaddr);
});
function broadcast() {
	Object.keys(ifaces).forEach(function (ifname) {
	  var alias = 0;
	  ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      return;
	    }
	    if (alias >= 1) {
	    } else {
	      if (ifname = "en0") {
	      	data.ip = iface.address;
	      	setInterval(broadcastf, 3000);
	      }
	    }
	    ++alias;
	  });
	});
}
function broadcastf() {
    var message = new Buffer(JSON.stringify(data));
    server.send(message, 0, message.length, port, mcastaddr);
}
module.exports.broadcast = broadcast;