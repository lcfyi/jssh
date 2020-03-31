const special = {
  description: "special mystery function",
  help: ["Usage", "", "special [values]"],
  async function() {
    this.terminal.writeln("Exit by typing 'no'");
    let val = await this.terminal.input(">> ");
    this.terminal.writeln(val);
    while (val !== "no") {
      val = await this.terminal.input(">> ");
      this.terminal.writeln(val);
    }
  }
};

export default special;
