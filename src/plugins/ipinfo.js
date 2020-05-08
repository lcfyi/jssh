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
    let ip = e.split(/[ ,]+/)[1];
    if (ip) {
      try {
        let response = JSON.parse(
          await request("https://json.geoiplookup.io/" + ip, {
            timeout: 5000,
          })
        );
        let printout = [
          `<a style='color:${colors.pink}'>Approximate location and info of ${response.ip}</a>`,
          `<a style='color:${colors.cyan}'>Hostname: </a>` + response.hostname,
          `<a style='color:${colors.cyan}'>District: </a>` + response.district,
          `<a style='color:${colors.cyan}'>Region: </a>` + response.region,
          `<a style='color:${colors.cyan}'>City: </a>` + response.city,
          `<a style='color:${colors.cyan}'>Country: </a>` +
            response.country_name,
          `<a style='color:${colors.cyan}'>Continent: </a>` +
            response.continent_code,
          `<a style='color:${colors.cyan}'>Postal code: </a>` +
            response.postal_code,
          `<a style='color:${colors.cyan}'>ISP: </a>` + response.isp,
          `<a style='color:${colors.cyan}'>Org: </a>` + response.org,
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
