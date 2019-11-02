import * as mathjs from "mathjs";

const convert = {
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
      }
      let val = mathjs.eval(expression).toString();
      this.parent.terminal.writeln(val);
    } catch (e) {
      let val = "math.js: " + e.message;
      this.parent.terminal.writeln(val);
    }
  }
};

export default convert;
