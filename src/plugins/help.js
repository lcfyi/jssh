import colors from "../colors.js";
import utils from "../utils.js";

const help = {
  description: "prints help messages",
  help: [
    "Prints help messages for particular commands. Can work",
    "on this command, too. Try it.",
  ],
  function(e) {
    let parse = utils.argParse(e);
    if (parse.length > 1 && parse[1]) {
      if (parse[1] in this.commands) {
        this.terminal.writeln(this.commands[parse[1]].help, true);
      } else {
        this.terminal.writeln("Unknown command " + "'" + parse[1] + "'");
      }
    } else {
      let text = [
        `<span style="color:${colors.cyan}">jsh</span>, <span style="color:${colors.red}">${__COMMIT_COUNT}</span>`,
        "These help prompts are defined by the plugins themselves. They may not be helpful.",
        "",
      ];
      this.terminal.writeln(text, true);
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
            `<span style="color:${colors.comment}">${utils.sanitize(
              this.commands[cmds[i]].description
            )}</span>`,
          true
        );
      }
    }
  },
};

export default help;
