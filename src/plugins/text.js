const text = {
  description: "sends texts (requires auth)",
  help: ["Usage", "", "text [number] [body]"],
  async function(e) {
    // Parse the message
    let to = await this.parent.terminal.input("To: ");
    let body = await this.parent.terminal.input("Message: ");

    let text = new XMLHttpRequest();
    text.open("POST", ".netlify/functions/text", false);
    text.setRequestHeader("authorization", this.parent.terminal.passwd);
    text.setRequestHeader("to", to);
    text.send(body);

    this.parent.terminal.writeln(text.responseText);
  }
};

export default text;
