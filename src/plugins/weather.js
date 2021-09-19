import request from "../request.js";
import utils from "../utils.js";

const URL = "https://wttr.in/?T";
const NUMBER_OF_LINES = 7; // Hardcoded because.. well

const weather = {
  description: "grabs the weather based on your current IP",
  help: ["Usage", "", "weather", "This uses wttr.in under the hood."],
  async function(e) {
    const weatherData = await request(URL);

    // We'll create a dummy element and dangerously set the contents
    // in order to extract the correct text; easier than manually writing
    // the relevant JSON options from the JSON endpoint

    const element = document.createElement("html");
    element.innerHTML = weatherData;

    const parsedWeatherData = element.querySelector("pre");

    if (parsedWeatherData) {
      const lines = utils.splitLines(parsedWeatherData.innerHTML);
      for (let i = 0; i < NUMBER_OF_LINES; i++) {
        this.terminal.writeln(lines[i]);
      }
      this.terminal.writeln("");
    } else {
      this.terminal.writeln(
        "weather: couldn't parse wttr.in response. Try again later."
      );
    }
  },
};

export default weather;
