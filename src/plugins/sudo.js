import colors from "../colors.js";
import request from "../request.js";
import jsonwebtoken from "jsonwebtoken";

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
      let token = await request(".netlify/functions/auth", {
        timeout: 10000,
        method: "POST",
        body: val,
      });
      let prompt = this.prompt;
      setTimeout(() => {
        this.prompt = prompt;
        delete this.terminal.passwd;
        this.terminal.writeln("Token expired.");
      }, jsonwebtoken.decode(token)["exp"] * 1000 - Date.now());
      this.terminal.passwd = token;
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
