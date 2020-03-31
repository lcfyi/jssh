import Terminal from "./term.js";
import termProps from "./termprops.js";
import request from "./request.js";
import "./aesthecc.css";

// Service worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

/**
 * On window load, we create a new terminal instance with
 * the properties we pass in, print the current time, and
 * log into our terminal.
 */
window.onload = async () => {
  let term = new Terminal(termProps);
  term.init(document.getElementById("terminal"));
  term.writeln("Current date and time: " + new Date().toString());
  try {
    let ip = new XMLHttpRequest();
    ip.open("GET", ".netlify/functions/echo");
    await request(ip, 1000);
    term.writeln("Connected from " + ip.responseText);
  } catch (e) {
    term.writeln("Couldn't get client identity.");
  }
  term.writeln(`Loading build <a href="https://github.com/lcfyi/decabyt.es/commit/${__COMMIT_HASH}">${__COMMIT_HASH}</a>`);
  term.writeln("----");
  term.login();
};
