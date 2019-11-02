const dec = {
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
      let val = "";
      if (expression.substring(0, 2) === "0b") {
        val = parseInt(expression.substring(2), 2).toString();
      } else if (expression.substring(0, 2) === "0x") {
        val = parseInt(expression.substring(2), 16).toString();
      } else if (expression.substring(0, 2) === "0o") {
        val = parseInt(expression.substring(2), 8).toString();
      } else {
        throw new Error("Not a valid base!");
      }
      if (isNaN(val)) {
        throw new Error("Malformed number!");
      }
      this.parent.terminal.writeln(val);
    } catch (error) {
      let val = "dec: " + error.message;
      this.parent.terminal.writeln(val);
    }
  }
};

export default dec;
