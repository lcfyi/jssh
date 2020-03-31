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
      switch (expression.substring(0, 2)) {
        case "0b":
          val = parseInt(expression.substring(2), 2).toString();
          break;
        case "0x":
          val = parseInt(expression.substring(2), 16).toString();
          break;
        case "0o":
          val = parseInt(expression.substring(2), 8).toString();
          break;
        default:
          throw new Error("Not a valid base!");
      }
      this.terminal.writeln(val);
    } catch (error) {
      let val = "dec: " + error.message;
      this.terminal.writeln(val);
    }
  }
};

export default dec;
