import request from "../request.js";
const text = {
  description: "sends texts (requires auth)",
  help: ["Usage", "", "text [number] [body]"],
  async function() {
    try {
      // Parse the message
      let to = await this.parent.terminal.input("To: ");
      let body = await this.parent.terminal.input("Message: ");
  
      let text = new XMLHttpRequest();
      text.open("POST", ".netlify/functions/text");
      text.setRequestHeader("authorization", this.parent.terminal.passwd);
      text.setRequestHeader("to", to);
      await request(text, 5000, body);
  
      this.parent.terminal.writeln(text.responseText);
    } catch (e) {
      this.parent.terminal.writeln("Couldn't send text.");
    }
  }
};

export default text;
