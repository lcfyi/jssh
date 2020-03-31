const time = {
  description: "prints the current time",
  help: ["No options"],
  function() {
    this.terminal.writeln(new Date().toString());
  }
};

export default time;
