const time = {
  description: "prints the current time",
  help: ["No options"],
  function() {
    this.parent.terminal.writeln(new Date().toString());
  }
};

export default time;
