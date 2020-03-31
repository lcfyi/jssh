const help = {
  description: "prints help messages",
  help: [
    "Prints help messages for particular commands. Can work",
    "on this command, too. Try it."
  ],
  function(e) {
    let parse = e.split(" ");
    if (parse.length > 1 && parse[1]) {
      if (parse[1] in this.commands) {
        this.terminal.writeln(this.commands[parse[1]].help);
      } else {
        this.terminal.writeln("Unknown command " + "'" + parse[1] + "'");
      }
    } else {
      let text = [
        `jsh, r${__COMMIT_COUNT}`,
        "These help prompts are defined by the plugins themselves. They may not be helpful.",
        ""
      ];
      this.terminal.writeln(text);
      // Get the keys of the commands
      let cmds = Object.keys(this.commands);
      let maxCount = cmds.reduce((max, cur) => {
        return cur.length > max ? cur.length : max;
      }, 0);

      for (let i = 0; i < cmds.length; i++) {
        this.terminal.writeln(
          cmds[i] +
            " ".repeat(maxCount - cmds[i].length) +
            "\t" +
            this.commands[cmds[i]].description
        );
      }
    }
  }
};

export default help;
