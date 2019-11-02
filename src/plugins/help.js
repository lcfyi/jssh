const help = {
  description: "prints help messages",
  help: [
    "Prints help messages for particular commands. Can work",
    "on this command, too. Try it."
  ],
  function(e) {
    let parse = e.split(" ");
    if (parse.length > 1 && parse[1]) {
      if (parse[1] in this.parent.commands) {
        this.parent.terminal.writeln(this.parent.commands[parse[1]].help);
      } else {
        this.parent.terminal.writeln("Unknown command " + "'" + parse[1] + "'");
      }
    } else {
      let text = [
        "jsh, version 0.1 ",
        "These help prompts are defined by the plugins themselves. They may not be helpful.",
        ""
      ];
      this.parent.terminal.writeln(text);
      // Get the keys of the commands
      let cmds = Object.keys(this.parent.commands);
      for (let i = 0; i < cmds.length; i++) {
        this.parent.terminal.writeln(
          cmds[i] + "\t \t" + this.parent.commands[cmds[i]].description
        );
      }
    }
  }
};

export default help;
