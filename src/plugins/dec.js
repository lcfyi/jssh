var dec = {
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
            this.parent.terminal.writeln(val);
        }
    }
};

export default dec;