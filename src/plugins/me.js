import request from "../request.js";

const me = {
  description: "gets your IP",
  help: ["Usage", "", "me", "Will return your IPv4/6 IP."],
  async function() {
    let ip = await request(".netlify/functions/echo", {
      timeout: 8000,
    });
    this.terminal.writeln(`Your IP is: ${ip}`);
  },
};

export default me;
