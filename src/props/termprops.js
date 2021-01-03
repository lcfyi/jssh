import colors from "../colors.js";

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
    {text: " ________                   ", color: colors.cyan },
    {text: "< hello. >                  ", color: colors.cyan },
    {text: " --------                   ", color: colors.cyan },
    {text: "        \\   ^__^            ", color: colors.orange },
    {text: "         \\  (oo)\\_______    ", color: colors.orange },
    {text: "            (__)\\       )\\/\\", color: colors.orange },
    {text: "                ||----w |   ", color: colors.orange },
    {text: "                ||     ||   ", color: colors.orange },
    " ",
    "Type 'help' for more information."
  ],
  commands: {},
  init() {
    for (let cmd in this.commands) {
      // Here we make sure we don't iterate into prototype methods
      // We use Object.prototype since hasOwnProperty could be overridden in this.commands
      if (Object.prototype.hasOwnProperty.call(this.commands, cmd)) {
        this.commands[cmd].function = this.commands[cmd].function.bind(this);
      }
    }
    delete this.init;
    return this;
  }
}.init();

export default termProps;
