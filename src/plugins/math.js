import * as mathjs from 'mathjs';

var math = {
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
                let crunch = mathjs.eval(expression);
                if (crunch === undefined) {
                    throw new Error("not math!");
                } else {
                    var val = crunch.toString();
                }
            }
        } catch (e) {
            val = "math.js: " + e.message;
        } finally {
            this.parent.terminal.writeln(val);
        }
    }
};

export default math;