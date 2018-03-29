function printf(string){
	process.stdout.write(string);
}
function reset() {
	//send escape code
	process.stdout.write('\033c');
}
module.exports.printf = printf;
module.exports.reset = reset;