import colors from "./dracula.js";

const termProps = {
  terminal: null,
  prompt:
    "<a style='color:" +
    colors.green +
    "'>~</a><a style='color:" +
    colors.purple +
    "'>$</a> ",
  login: [
    " ",
    { text: " _          _   _       ", color: colors.pink },
    { text: "| |        | | | |      ", color: colors.pink },
    { text: "| |     _  | | | |  __  ", color: colors.pink },
    { text: "|/ \\   |/  |/  |/  /  \\_", color: colors.pink },
    { text: "|   |_/|__/|__/|__/\\__/o", color: colors.pink },
    " ",
    "Type 'help' for more information."
  ],
  commands: {},
  init() {
    for (let cmd in this.commands) {
      // Here we make sure we don't iterate into prototype methods
      if (Object.prototype.hasOwnProperty.call(this.commands, cmd)) {
        this.commands[cmd].parent = this;
      }
    }
    delete this.init;
    return this;
  }
}.init();

export default termProps;
