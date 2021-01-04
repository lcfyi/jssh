import request from "../request.js";
import colors from "../colors.js";

const ipinfo = {
  description: "prints out information about the given IP/hostname",
  help: [
    "Usage",
    "",
    "ipinfo <hostname/IP>",
    "Note that you shouldn't have any spaces except between ipinfo",
    "the hostname/IP",
  ],
  async function(e) {
    // TODO check if the IP is properly formed
    let ip = e.split(/[ ]+/)[1];
    if (ip) {
      try {
        let response = JSON.parse(
          await request("https://json.geoiplookup.io/" + ip, {
            timeout: 5000,
          })
        );
        let printout = [
          `<span style='color:${colors.pink}'>Approximate location and info of ${response.ip}</span>`,
          `<span style='color:${colors.cyan}'>Hostname: </span>` + response.hostname,
          `<span style='color:${colors.cyan}'>District: </span>` + response.district,
          `<span style='color:${colors.cyan}'>Region: </span>` + response.region,
          `<span style='color:${colors.cyan}'>City: </span>` + response.city,
          `<span style='color:${colors.cyan}'>Country: </span>` +
            response.country_name,
          `<span style='color:${colors.cyan}'>Continent: </span>` +
            response.continent_code,
          `<span style='color:${colors.cyan}'>Postal code: </span>` +
            response.postal_code,
          `<span style='color:${colors.cyan}'>ISP: </span>` + response.isp,
          `<span style='color:${colors.cyan}'>Org: </span>` + response.org,
        ];
        this.terminal.writeln(printout, true);
      } catch (e) {
        this.terminal.writeln("Error trying to get hostname info!");
      }
    } else {
      this.terminal.writeln("You must specify a hostname!");
    }
  },
};

export default ipinfo;
