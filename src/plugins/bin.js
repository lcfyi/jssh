const bin = {
  description: "prints the binary of a number",
  help: [
    "Usage",
    "",
    "bin [value] [number of digits]",
    "Will return the binary value of the number, with up to",
    "the specified digits. Will error out if the digits are ",
    "less than the actual value's digit count.",
  ],
  function(e) {
    let parse = e.split(" ");
    try {
      let val = parseInt(parse[1]);
      if (isNaN(val)) {
        throw new Error("Not a valid number!");
      }
      switch (parse[1].substring(0, 2)) {
        case "0b":
          val = parseInt(parse[1].substring(2), 2);
          break;
        case "0x":
          val = parseInt(parse[1].substring(2), 16);
          break;
        case "0o":
          val = parseInt(parse[1].substring(2), 8);
          break;
      }

      val = val.toString(2);

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
      this.terminal.writeln("0b" + val.toUpperCase());
      this.terminal.writeln("Digit count: " + val.length);
    } catch (error) {
      let val = "bin: " + error.message;
      this.terminal.writeln(val);
    }
  },
};

export default bin;
