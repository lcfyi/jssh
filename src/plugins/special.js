const special = {
  description: "special mystery function",
  help: ["Usage", "", "special [values]"],
  async function(e) {
    this.parent.terminal.writeln("Exit by typing 'no'");
    let val = await this.parent.terminal.input(">> ");
    this.parent.terminal.writeln(val);
    while (val !== "no") {
      val = await this.parent.terminal.input(">> ");
      this.parent.terminal.writeln(val);
    }
  }
};

export default special;
