import request from "../request.js";
import colors from "../colors.js";

const whois = {
  description: "attempts to retrieve the whois information of the domain",
  help: [
    "Usage",
    "",
    "whois <domain>",
    "Attempts to retrieve the latest whois information about the domain.",
  ],
  async function(e) {
    let host = e.split(/[ ]+/)[1];
    if (host) {
      try {
        let response = JSON.parse(
          await request("/.netlify/functions/whois", {
            method: "POST",
            body: host,
          })
        );
        let printout = [
          `<span style='color:${colors.pink}'>WHOIS Information</span>`,
        ];
        for (let entry in response) {
          printout.push(
            `<span style='color:${colors.cyan}'>${entry}: </span>${response[entry]}`
          );
        }
        this.terminal.writeln(printout, true);
      } catch (e) {
        this.terminal.writeln(`Error: ${e.message ? e.message : e}`);
      }
    } else {
      this.terminal.writeln("You must specify a domain!");
    }
  },
};

export default whois;
