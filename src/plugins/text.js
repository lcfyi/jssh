import request from "../request.js";
const text = {
  description: "sends texts (requires auth)",
  help: ["Usage", "", "text [number] [body]"],
  async function() {
    try {
      // Parse the message
      let to = await this.terminal.input("To: ");
      let body = await this.terminal.input("Message: ");

      let text = await request(".netlify/functions/text", {
        timeout: 5000,
        method: "POST",
        headers: {
          authorization: this.terminal.passwd ? this.terminal.passwd : "",
          to: to,
        },
        body: body,
      });

      this.terminal.writeln(`Twilio response: ${text}`);
    } catch (e) {
      this.terminal.writeln(`Couldn't send text: ${e ? e : "No response."}`);
    }
  },
};

export default text;
