const hex = {
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
      }
      let val = parseInt(parse[1]).toString(16);
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
      this.parent.terminal.writeln("0x" + val.toUpperCase());
      this.parent.terminal.writeln("Digit count: " + val.length);
    } catch (error) {
      let val = "hex: " + error.message;
      this.parent.terminal.writeln(val);
    }
  }
};

export default hex;
