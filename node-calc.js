const dr = require("./dice-roller.js");
var dice = new dr.DiceRoller();
var lastRoll = null;
const readline = require("readline");
const clipboard = require("clipboardy");

require("./utils");

process.stdout.write("\033c");

var outputRaw = true;
var lastResult = "";
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
    // Don't output this raw
    outputRaw = false;
    // Roll
    lastRoll = dice.roll(cmd);
    // Log result
    console.log(lastRoll.toString());
    // Save last result
    lastResult = lastRoll.getTotal().toString();
    // Revert to raw outputting
    outputRaw = true;
};

function defaultCommand(line) {
    if(outputRaw) {
        try {
            lastResult = eval(line);
            if(typeof lastResult === "number") {
                lastResult = lastResult.toString();
            }
            console.log(lastResult);
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

function handleKeyPress(key, ev) {
    if(ev.ctrl) {
        // Copy
        if(ev.name === "c") {
            copyToClipboard();
        }
        // Paste
        else if(ev.name === "v") {
            pasteFromClipboard();
        }
    }
};

function copyToClipboard() {
    clipboard.write(lastResult);
};

function pasteFromClipboard() {
    var content = clipboard.readSync();
    rl.write(content);
};

process.stdout.write("NodeJS RPG Dice Roller loaded.\n\n");

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.input.on("keypress", handleKeyPress);

// Disable SIGINT
rl.on("SIGINT", function() {});

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
