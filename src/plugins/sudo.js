import colors from "../dracula.js";
import request from "../request.js";

const sudo = {
  description: "authentication",
  help: ["Usage", "", "sudo"],
  async function() {
    let promise = this.terminal.input("");
    this.terminal.workingPrompt.input.type = "password";
    let element = this.terminal.workingPrompt.element;
    let val = await promise;
    element.innerHTML = "";

    let status = -1;
    let payload = "";

    try {
      let a = new XMLHttpRequest();
      a.open("POST", ".netlify/functions/auth");
      await request(a, 5000, val);

      status = a.status;
      payload = a.responseText;
    } catch (e) {
      this.terminal.writeln("Failed to authorize.");
      return;
    }
    if (status === 200) {
      this.terminal.passwd = payload;
      this.prompt =
        "<a style='color:" +
        colors.green +
        "'>~</a><a style='color:" +
        colors.purple +
        "'>#</a> ";
    } else if (status === 401) {
      this.terminal.writeln(payload);
    }
  }
};

export default sudo;
