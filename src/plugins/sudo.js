import colors from "../dracula.js";
import request from "../request.js";

const sudo = {
  description: "authentication",
  help: ["Usage", "", "sudo"],
  async function() {
    let promise = this.parent.terminal.input("");
    this.parent.terminal.workingPrompt.input.type = "password";
    let element = this.parent.terminal.workingPrompt.element;
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
      this.parent.terminal.writeln("Failed to authorize.");
      return;
    }
    if (status === 200) {
      this.parent.terminal.passwd = payload;
      this.parent.prompt =
        "<a style='color:" +
        colors.green +
        "'>~</a><a style='color:" +
        colors.purple +
        "'>#</a> ";
    } else if (status === 401) {
      this.parent.terminal.writeln(payload);
    }
  }
};

export default sudo;
