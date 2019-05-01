import * as mathjs from 'mathjs';

var convert = {
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
                var val = mathjs.eval(expression).toString();
            }
        } catch (e) {
            val = "math.js: " + e.message;
        } finally {
            this.parent.terminal.writeln(val);
        }
    }
};

export default convert;