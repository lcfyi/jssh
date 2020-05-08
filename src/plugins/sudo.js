import colors from "../colors.js";
import request from "../request.js";

const sudo = {
  description: "authentication",
  help: [
    "Usage",
    "",
    "sudo",
    "",
    "This command, on successful password input, returns a dated and signed JWT",
    "that will grant you access to elevated resources for a limited time.",
  ],
  /*
   * Naively, we just leave our token under terminal.passwd so that other functions
   * can access it and set it as the authorizatio header for future calls.
   */
  async function() {
    let promise = this.terminal.input();
    this.terminal.workingPrompt.input.type = "password";
    // Save the element before we return the promise, since it gets destroyed
    let element = this.terminal.workingPrompt.element;
    let val = await promise;
    element.innerHTML = "";

    try {
      this.terminal.passwd = await request(".netlify/functions/auth", {
        timeout: 10000,
        method: "POST",
        body: val,
      });
      this.prompt =
        "<a style='color:" +
        colors.green +
        "'>~</a><a style='color:" +
        colors.purple +
        "'>#</a> ";
    } catch (e) {
      this.terminal.writeln("Failed to authorize.");
    }
  },
};

export default sudo;
