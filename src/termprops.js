import * as math from 'mathjs';

var termProps = {
    terminal: undefined,
    prompt: "<a style='color:#50fa7b'>ts</a>@<a style='color:#bd93f9'>4.26</a> ~$ ",
    login: [
        "It's rew- forward time.",
        "                                                  ",      
        ["        %             %                   ", "#ff5555"], 
        ["        %%%           %%%                 ", "#ff5555"], 
        ["        %%%%%         %%%%%               ", "#ff5555"], 
        ["        %%%%%%%       %%%%%%%             ", "#ff5555"], 
        ["        %%%%%%%%%     %%%%%%%%%           ", "#ff5555"], 
        ["        %%%%%%%%%%%   %%%%%%%%%%%         ", "#ff5555"], 
        ["        %%%%%%%%%%%%% %%%%%%%%%%%%%       ", "#ff5555"], 
        ["        %%%%%%%%%%%%  %%%%%%%%%%%%        ", "#ff5555"], 
        ["        %%%%%%%%%%    %%%%%%%%%%          ", "#ff5555"], 
        ["        %%%%%%%%      %%%%%%%%            ", "#ff5555"], 
        ["        %%%%%%        %%%%%%              ", "#ff5555"], 
        ["        %%%%          %%%%                ", "#ff5555"], 
        ["        %%            %%                  ", "#ff5555"], 
        ["        %             %                   ", "#ff5555"], 
        "",
        "----",
        "Type 'help' for more information."
    ],
    commands: {
        help: {
            description: "prints help messages",
            help: [
                "Prints help messages for particular commands. Can work",
                "on this command, too. Try it."
            ],
            function(e) {
                let parse = e.split(" ");
                if (parse.length > 1 && parse[1] !== "") {
                    if (parse[1] in termProps.commands) {
                        termProps.terminal.writeln(termProps.commands[parse[1]].help);
                    } else {
                        termProps.terminal.writeln("Unknown command " + "'" + parse[1] + "'");
                    }                    
                } else {
                    let text = [
                        "wa-bash, version 0.1 (js)",
                        "These commands are defined internally, so there's not a lot",
                        "of functionality at the moment.",
                        ""
                    ]
                    termProps.terminal.writeln(text);
                    // Get the keys of the commands
                    let cmds = Object.keys(termProps.commands);
                    for (let i = 0; i < cmds.length; i++) {
                        termProps.terminal.writeln(cmds[i] + "\t \t" 
                                + termProps.commands[cmds[i]].description);
                    }
                }
                
            }
        },
        source: {
            description: "the source",
            help: [
                "Prints the source of this site."
            ],
            function(e) {
                let link = "https://github.com/lcheng1/decabyt.es";
                termProps.terminal.writeln("<a href='" + link + "' target='_blank'>github</a>");
            }
        },
        math: {
            description: "does math",
            help: [
                "This command does math for you. It takes the expression",
                "after the command 'math' and evaluates it with js.",
                "",
                "math [expression]",
                "",
                "Examples",
                "math sin(pi)",
                "math (12 + 23) / 23 * 32 ^ 2 + 123"
            ],
            function(e) {
                // We're not gonna use regex for this
                let expression = e.substring(e.indexOf(" ") + 1);
                try {
                    if (expression.includes("to") || expression.includes("math")) {
                        throw new Error("not math!");
                    } else {
                        var val = math.eval(expression);
                    }
                } catch (e) {
                    var val = "math.js: " + e.message;
                } finally {
                    termProps.terminal.writeln(val.toString());
                }
            }
        },
        convert: {
            description: "converts things",
            help: [
                "This function tries to be smart and parses your input based",
                "on the unit appended to the end of it. But of course, it's not",
                "infallable.",
                "",
                "convert [value][unit] to [unit]",
                "Space between value and unit is optional.",
                "Supported units are degF, degC, length/weight, most things actually.",
                "",
                "Examples",
                "convert 12degF to degC",
                "convert 100mm to nm"
            ],
            function(e) {
                let expression = e.substring(e.indexOf(" ") + 1);
                try {
                    if (!expression.includes("to") || expression.includes("convert")) {
                        throw new Error("not a conversion!");
                    } else {
                        var val = math.eval(expression);
                    }
                } catch (e) {
                    var val = "math.js: " + e.message;
                } finally {
                    termProps.terminal.writeln(val.toString());
                }
            }
        },
        special: {
            description: "special mystery function",
            help: [
                "Usage",
                "",
                "special [values]"
            ],
            function(e) {
                
            }
        },
        iploc: {
            description: "gets the geolocation of a particular IP",
            help: [
                "Usage",
                "",
                ""
            ],
            function(e) {

            }
        },
        time: {
            description: "prints the current time",
            help: [
                "No options",
            ],
            function() {
                termProps.terminal.writeln(new Date().toString());
            }
        },
        hex: {
            description: "prints the hex of a number",
            help: [
                "Usage",
                "",
                "hex [value] [digits]",
                "Will return the hex value of the number, with up to",
                "the specified digits. Will error out if the digits are ",
                "less than the actual value's digit count."
            ],
            function(e) {
                let parse = e.split(" ");
                try {
                    if (isNaN(parse[1])) {
                        throw new Error("Not a valid number!");
                    } else {
                        var val = parseInt(parse[1]).toString(16);
                    }
                    let digits = parseInt(parse[2]);
                    if (!isNaN(digits)) {
                        if (val.length > digits) {
                            throw new Error("Actual digit count exceeds desired!");
                        } else {
                            while (val.length < digits) {
                                val = "0" + val;
                            }
                        }
                    }
                    termProps.terminal.writeln("0x" + val.toUpperCase());
                    termProps.terminal.writeln("Digit count: " + val.length);
                } catch(error) {
                    var val = "hex: " + error.message;
                    termProps.terminal.writeln(val);
                }
            }
        },
        bin: {
            description: "prints the binary of a number",
            help: [
                "Usage",
                "",
                "bin [value] [digits]",
                "Will return the binary value of the number, with up to",
                "the specified digits. Will error out if the digits are ",
                "less than the actual value's digit count."
            ],
            function(e) {
                let parse = e.split(" ");
                try {
                    if (isNaN(parse[1])) {
                        throw new Error("Not a valid number!");
                    } else {
                        var val = parseInt(parse[1]).toString(2);
                    }
                    let digits = parseInt(parse[2]);
                    if (!isNaN(digits)) {
                        if (val.length > digits) {
                            throw new Error("Actual digit count exceeds desired!");
                        } else {
                            while (val.length < digits) {
                                val = "0" + val;
                            }
                        }
                    }
                    termProps.terminal.writeln("0b" + val.toUpperCase());
                    termProps.terminal.writeln("Digit count: " + val.length);
                } catch(error) {
                    var val = "hex: " + error.message;
                    termProps.terminal.writeln(val);
                }
            }
        },
        dec: {
            description: "converts the number to decimal",
            help: [
                "Usage",
                "",
                "dec [base][digits]",
                "Types of bases are 0x for hex, 0b for binary, and 0o for octal."
            ],
            function(e) {
                let expression = e.substring(e.indexOf(" ") + 1);
                try {
                    if (expression.substring(0, 2) === "0b") {
                        var val = parseInt(expression.substring(2), 2);
                    } else if (expression.substring(0, 2) === "0x") {
                        var val = parseInt(expression.substring(2), 16);
                    } else if (expression.substring(0, 2) === "0o") {
                        var val = parseInt(expression.substring(2), 8);
                    } else {
                        throw new Error("Not a valid base!");
                    }
                    if (isNaN(val)) {
                        throw new Error("Malformed number!");
                    }
                } catch (error) {
                    var val = "dec: " + error.message;
                } finally {
                    termProps.terminal.writeln(val);
                }
            }
        }
    }
};

export default termProps;