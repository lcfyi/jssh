const count = {
  description: "counts the number of characters in a string",
  help: [
    "Usage",
    "",
    "count [string]",
    "Returns the character count of the string."
  ],
  function(e) {
    if (e.includes(" ")) {
      let expression = e.substring(e.indexOf(" ") + 1);
      this.terminal.writeln(`Character count: ${[...expression].length}`);
    } else {
      this.terminal.writeln("No input.");
    }
  }
};

export default count;
