import Terminal from "./term.js";
import termProps from "./termprops.js";
import request from "./request.js";
import "./aesthecc.css";

/**
 * On window load, we create a new terminal instance with
 * the properties we pass in, print the current time, and
 * log into our terminal.
 */
window.onload = async () => {
  let term = new Terminal(termProps);
  term.init(document.getElementById("terminal"));
  try {
    let ip = new XMLHttpRequest();
    ip.open("GET", "https://json.geoiplookup.io/");
    await request(ip, 1000);
    let payload = JSON.parse(ip.responseText);
    term.writeln("Current date and time: " + new Date().toString());
    term.writeln("Connected from " + payload.ip);
    term.writeln("----");
  } catch (e) {
    // Internet issues, can't resolve hostname
    term.writeln("Current date and time: " + new Date().toString());
    term.writeln("Not connected to the internet.");
    term.writeln("----");
  }
  term.login();
};
