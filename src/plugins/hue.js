import request from "../request.js";
import colors from "../colors.js";
import utils from "../utils.js";
import help from "./help.js";

const hue = {
  description: "controls your hue lights",
  help: [
    `<span style="color:${colors.red}">Usage</span>`,
    "Note that only one hue base can be paired to a browser at a time.",
    "",
    `<span style="color:${colors.green}">examples</span>`,
    `  hue help                  <span style="color:${colors.comment}"># show this prompt</span>`,
    `  hue search                <span style="color:${colors.comment}"># find base stations on the subnet`,
    `  hue register 192.168.0.1  <span style="color:${colors.comment}"># register a base station to this browser`,
    `  hue reset                 <span style="color:${colors.comment}"># resets the currently saved base`,
    `  hue config                <span style="color:${colors.comment}"># get the address of the current base (if any)`,
    `  hue list                  <span style="color:${colors.comment}"># list available lights`,
    `  hue lights 1,2 on         <span style="color:${colors.comment}"># turns lights 1 and 2 on`,
    `  hue lights all on         <span style="color:${colors.comment}"># turns all lights on`,
    `  hue lights all off        <span style="color:${colors.comment}"># turns all lights off`,
    `  hue lights all 1,2,123    <span style="color:${colors.comment}"># sets all lights to bri=1, sat=2, hue=123`,
    "",
    "Note that for manual settings, 0 <= bri <= 254, 0 <= sat <= 254, and",
    "0 <= hue <= 65535. The command will clip your output.",
    "",
    `<span style="color:${colors.green}">commands</span>`,
    "  help, search, register, config, reset, list, lights",
    "",
    `<span style="color:${colors.green}">presets</span>`,
    "  savanna, tropical, arctic, spring, relax, read,",
    "  concentrate, energize, bright, dimmed, nightlight",
    "",
    `<span style="color:${colors.red}">caveats</span>`,
    "  Note that since the hue is on your local network, you'll have to",
    "  visit the website occasionally to allow your browser to access the",
    "  hue bridge over an invalid SSL certificate.",
  ],
  async function(e) {
    const args = utils.argParse(e);
    if (args.length <= 1) {
      return help.function("help hue");
    }
    switch (args[1]) {
      case "help":
        return help.function("help hue");
      case "search":
        return search(this);
      case "reset":
        return reset(this);
      case "config":
        return config(this);
      case "register":
        if (args[2]) {
          return register(this, args[2]);
        } else {
          return this.terminal.writeln("Malformed arguments.");
        }
      case "list":
        if (CredentialsManager.credentials) {
          return list(this);
        } else {
          return unauthorized(this);
        }
      case "lights":
        if (CredentialsManager.credentials) {
          return set(this, args[2], args[3]);
        } else {
          return unauthorized(this);
        }
      default:
        this.terminal.writeln("Unrecognized command. Try help hue.");
    }
  },
};

const DISCOVERY_URL = "https://discovery.meethue.com/";
const HUE_ADDR_BASE = "https://";
const CREDENTIALS_LS_KEY = "hue_credentials";
const MAX_REGISTER_TRIES = 20;
const HUE_PRESETS = {
  savanna: {
    bri: 199,
    sat: 209,
    hue: 10332,
  },
  tropical: {
    bri: 123,
    sat: 120,
    hue: 4325,
  },
  arctic: {
    bri: 137,
    sat: 254,
    hue: 41502,
  },
  spring: {
    bri: 214,
    sat: 100,
    hue: 56063,
  },
  relax: {
    bri: 144,
    sat: 199,
    hue: 7676,
  },
  read: {
    bri: 254,
    sat: 199,
    hue: 8597,
  },
  concentrate: {
    bri: 254,
    sat: 13,
    hue: 39392,
  },
  energize: {
    bri: 254,
    sat: 75,
    hue: 41442,
  },
  bright: {
    bri: 254,
    sat: 140,
    hue: 8402,
  },
  dimmed: {
    bri: 77,
    sat: 140,
    hue: 8402,
  },
  nightlight: {
    bri: 1,
    sat: 251,
    hue: 6291,
  },
};

class CredentialsManager {
  static clear() {
    localStorage.removeItem(CREDENTIALS_LS_KEY);
  }

  static set credentials({ username, address }) {
    if (username && address) {
      localStorage.setItem(
        CREDENTIALS_LS_KEY,
        JSON.stringify({
          username: username,
          address: address,
        })
      );
    }
  }

  static get credentials() {
    const lsResult = localStorage.getItem(CREDENTIALS_LS_KEY);
    if (lsResult) {
      return JSON.parse(lsResult);
    } else {
      return undefined;
    }
  }
}

async function search(context) {
  const discoveredStations = JSON.parse(await request(DISCOVERY_URL));
  if (discoveredStations.length) {
    context.terminal.writeln("Stations found:");
    for (let [i, station] of discoveredStations.entries()) {
      context.terminal.writeln(`${i + 1} - ${station["internalipaddress"]}`);
    }
    context.terminal.writeln(
      "Register one of them with: hue register <address>"
    );
  } else {
    context.terminal.writeln("No stations found.");
  }
}

async function register(context, address) {
  if (address.startsWith("http")) {
    address = "".replace("http://", "").replace("https://", "");
  }
  const registerHandler = async () => {
    return JSON.parse(
      await request(`${HUE_ADDR_BASE}${address}/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devicetype: "jssh",
        }),
      })
    );
  };
  try {
    await registerHandler();
  } catch (e) {
    return certificateError(context, address);
  }
  context.terminal.writeln(
    "Now press the link button... (refresh your browser to cancel)"
  );
  for (let i = 0; i < MAX_REGISTER_TRIES; i++) {
    await utils.sleep(500);
    let result = await registerHandler();
    if ("success" in result[0]) {
      CredentialsManager.credentials = {
        username: result[0]["success"]["username"],
        address: address,
      };
      return context.terminal.writeln(
        "Success! That base is now registered to this browser."
      );
    }
  }
}

async function reset(context) {
  CredentialsManager.clear();
  context.terminal.writeln("Cleared saved credentials.");
}

async function config(context) {
  const credentials = CredentialsManager.credentials;
  if (credentials) {
    context.terminal.writeln(
      `Currently saved base station: ${credentials.address}`
    );
  } else {
    context.terminal.writeln("No saved base station.");
  }
}

async function list(context) {
  const allLights = await getAllLights();
  for (let [light, name] of Object.entries(allLights)) {
    context.terminal.writeln(` ${light} - ${name}`);
  }
}

async function set(context, lights, setting) {
  if (lights === "all") {
    lights = Object.keys(await getAllLights());
  } else {
    lights = lights.split(",").filter((e) => e && !isNaN(e));
  }
  const setLights = async (parsedSetting = {}) => {
    // Cache the credentials to reduce the syncronous localStorage calls
    const credentials = CredentialsManager.credentials;
    for (let light of lights) {
      try {
        let res = JSON.parse(
          await request(
            HUE_ADDR_BASE +
              credentials.address +
              "/api/" +
              credentials.username +
              "/lights/" +
              light +
              "/state",
            {
              method: "PUT",
              body: JSON.stringify({
                on: true, // by default, we'll turn on the light
                ...parsedSetting,
              }),
              timeout: 3000,
            }
          )
        );
        context.terminal.writeln(
          `Response(s) from ${light}: ${res
            .map((e) => Object.keys(e)[0])
            .join(", ")}`
        );
      } catch (e) {
        return certificateError(context, credentials.address);
      }
    }
  };
  if (lights.length) {
    // Simple turn on switch
    switch (setting) {
      case "on":
        return setLights();
      case "off":
        return setLights({ on: false });
    }
    // Check presets
    if (setting in HUE_PRESETS) {
      return setLights(HUE_PRESETS[setting]);
    }
    let [bri, sat, hue] = setting.split(",").map((e) => Number(e));
    // Check undefined specifically since these values can be 0
    if (bri !== undefined && sat !== undefined && hue !== undefined) {
      if (bri > 254) bri = 254;
      if (bri < 0) bri = 0;
      if (sat > 254) sat = 254;
      if (sat < 0) sat = 0;
      if (hue < 0) hue = 0;
      if (hue > 65535) hue = 65535;
      context.terminal.writeln(`Setting bri: ${bri}, sat: ${sat}, hue: ${hue}`);
      return setLights({
        bri: bri,
        sat: sat,
        hue: hue,
      });
    }
    context.terminal.writeln("Couldn't parse setting. Check the help notes?");
  } else {
    context.terminal.writeln("Lights should be numerical indices.");
  }
}

async function certificateError(context, address) {
  if (context) {
    context.terminal.writeln(
      `Failed to ping the base station. You may have to accept the invalid certificate first by visiting <a href="${HUE_ADDR_BASE}${address}" target="_blank">this page</a>.`,
      true
    );
  }
  throw new Error("Network error.");
}

async function unauthorized(context) {
  context.terminal.writeln("You must register a hue base station first.");
}

async function getAllLights() {
  const credentials = CredentialsManager.credentials;
  try {
    const lightsList = JSON.parse(
      await request(
        HUE_ADDR_BASE +
          credentials.address +
          "/api/" +
          credentials.username +
          "/lights"
      )
    );
    let lightsMap = {};
    for (let [light, metadata] of Object.entries(lightsList)) {
      lightsMap[light] = metadata["name"];
    }
    return lightsMap;
  } catch (e) {
    return certificateError(context, credentials.address);
  }
}

export default hue;
