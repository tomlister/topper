var lib = require("./lib.js")
function quickrpt(char, amt) {
	var ren = "";
	for (var i = 0; i < amt; i++) {
		ren += char;
	}
	return ren;
}
function title(title, override) {
	var rendertext = "█  "+title+"  █"
	if (override) {
		rendertext = "█  "+title+quickrpt(" ",override)+"█"
	} else {
		rendertext = "█  "+title+"  █"
	}
	lib.printl("▄", rendertext.length);
	lib.printf("\n");
	lib.printf(rendertext);
	lib.printf("\n");
	lib.printl("▀", rendertext.length);
	lib.printf("\n");
}

function button(title, override) {
	var rendertext = "█  "+title+"  █"
	if (override) {
		rendertext = "█  "+title+quickrpt(" ",override)+"█"
	} else {
		rendertext = "█  "+title+"  █"
	}
	lib.printl("▁", rendertext.length);
	lib.printf("\n");
	lib.printf(rendertext);
	lib.printf("\n");
	lib.printl("▔", rendertext.length);
	lib.printf("\n");
}

function text(string) {
	lib.printf(string);
}
function input(input) {
	lib.printl("▁", 17);
	lib.printf("\n");
	if (input == '') {
		lib.printf("█");
		lib.printl(" ", 15);
		lib.printf("█");
	} else {
		lib.printf("█"+input);
		lib.printl(" ", 15 - input.length);
		lib.printf("█");
	}
	lib.printf("\n");
	lib.printl("▔", 17);
	lib.printf("\n");
}

module.exports.title = title;
module.exports.button = button;
module.exports.text = text;
module.exports.input = input;