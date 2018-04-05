function printf(string){
	process.stdout.write(string);
}
function reset() {
	//send escape code
	process.stdout.write('\033c');
}
function printl(char, amt) {
	var ren = "";
	for (var i = 0; i < amt; i++) {
		ren += char;
	}
	printf(ren);
}
module.exports.printf = printf;
module.exports.printl = printl;
module.exports.reset = reset;