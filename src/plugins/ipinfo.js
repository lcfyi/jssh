import request from "../request.js";

const ipinfo = {
  description: "prints out information about the given IP/hostname",
  help: [
    "Usage",
    "",
    "ipinfo <hostname/IP>",
    "Note that you shouldn't have any spaces except between ipinfo",
    "the hostname/IP"
  ],
  async function(e) {
    // TODO check if the IP is properly formed
    let ip = e.split(/[ ,]+/)[1];
    if (ip) {
      try {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://json.geoiplookup.io/" + ip);
        await request(xhr, 5000);
        let response = JSON.parse(xhr.responseText);
        let printout = [
          "<a style='color:#ff79c6'>Approximate location and info of " +
            response.ip +
            "</a>",
          "<a style='color:#8be9fd'>Hostname: </a>" + response.hostname,
          "<a style='color:#8be9fd'>District: </a>" + response.district,
          "<a style='color:#8be9fd'>Region: </a>" + response.region,
          "<a style='color:#8be9fd'>City: </a>" + response.city,
          "<a style='color:#8be9fd'>Country: </a>" + response.country_name,
          "<a style='color:#8be9fd'>Continent: </a>" + response.continent_code,
          "<a style='color:#8be9fd'>Postal code: </a>" + response.postal_code,
          "<a style='color:#8be9fd'>ISP: </a>" + response.isp,
          "<a style='color:#8be9fd'>Org: </a>" + response.org
        ];
        this.parent.terminal.writeln(printout);
      } catch (e) {
        this.parent.terminal.writeln("Error trying to get hostname info!");
      }
    } else {
      this.parent.terminal.writeln("You must specify a hostname!");
    }
  }
};

export default ipinfo;
