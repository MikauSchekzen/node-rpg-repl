const dr = require("./dice-roller.js");
var dice = new dr.DiceRoller();
var lastRoll = null;
const readline = require("readline");

var outputRaw = true;
var help = {
    basic: "Define what you want help with.\n\n" +
        "'help commands' - List special commands\n" +
        "\n",
    commands: "Possible commands (next to default JS and NodeJS ones):\n" +
        getSeparatorLine() + "\n" +
        "'roll <cmd>' - Replace <cmd> with something like '1d6' or '2d10+15'\n\n"
};

function getSeparatorLine() {
    let a = 0;
    let cols = process.stdout.columns;
    let str = "";
    while(a < cols) {
        if(a % 2 === 0) str += "=";
        else str += "-"
        a++
    }
    return str;
}

function showHelp(about) {
	if(about === "basic") {
		process.stdout.write(help.basic);
	}
	else if(about.match(/(?:COMMANDS?|CMDS?)/i)) {
		process.stdout.write(help.commands);
	}
};

function roll(cmd) {
    outputRaw = false;
    lastRoll = dice.roll(cmd);
    console.log(lastRoll.toString());
    outputRaw = true;
};

function defaultCommand(line) {
	if(outputRaw) {
          try {
            console.log(eval(line));
          }
          catch(err) {
            console.error(err);
          }
        }
	else {
          try {
            eval(line);
          }
          catch(err) {
            console.error(err);
          }
        }
};

process.stdout.write("NodeJS RPG Dice Roller loaded.\n\n" + help.commands);

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.prompt();

rl.on("line", function(line) {
	if(line.match(/^EXIT$/i)) {
		rl.close();
	}
	else if(line.match(/^HELP$/i)) {
		showHelp("basic");
	}
	else if(line.match(/^HELP[ ]([a-zA-Z0-9]+)$/i)) {
		showHelp(RegExp.$1);
	}
	else if(line.match(/^R(?:OLL)?[ ](.+)$/i)) {
		roll(RegExp.$1);
	}
	else defaultCommand(line);
	rl.prompt();
});
rl.on("close", function() {
	process.stdout.write("\n");
	process.exit(0);
});
