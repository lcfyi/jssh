import colors from "../colors.js";
import request from "../request.js";
import utils from "../utils.js";

const CACHE_URL = "https://tldr.sh/assets/index.json";
const BASE_URL =
  "https://raw.githubusercontent.com/tldr-pages/tldr/master/pages";
const DEFAULT_LANG = "en";

const tldr = {
  description: "get a tldr of a particular CLI command",
  help: [
    "Usage",
    "",
    "tldr <command>",
    "",
    "Uses tldr <https://tldr.sh/> to get help pages for",
    "specific CLI commands.",
  ],
  async function(e) {
    if (!this.cacheMapping) {
      this.terminal.writeln("Updating cache...");
      await updateCache(this);
    }
    let args = utils.argParse(e).slice(1);
    let command = args[0] ? args[0].toLowerCase() : "";

    if (this.cacheMapping.has(command)) {
      const commandMetadata = this.cacheMapping.get(command);

      if (commandMetadata.language.includes(DEFAULT_LANG)) {
        let platforms = commandMetadata.platform;
        let platform = platforms[0];

        if (platforms.length > 1) {
          this.terminal.writeln(
            "This command has info for multiple platforms:"
          );

          for (let [i, platform] of platforms.entries()) {
            this.terminal.writeln(`  ${i}. ${platform}`);
          }
          let platformIdx = null;

          do {
            if (platformIdx !== null) {
              this.terminal.writeln("Invalid choice, try again.");
            }
            platformIdx = parseInt(
              await this.terminal.input(`Choice [0-${platforms.length - 1}]: `)
            );
          } while (
            isNaN(platformIdx) ||
            platformIdx < 0 ||
            platformIdx >= platforms.length
          );
          platform = platforms[platformIdx];
        }

        let commandInfo = await getCommandInfo(command, platform, DEFAULT_LANG);
        this.terminal.writeln("--------");
        this.terminal.writeln(formatMarkdown(commandInfo), true);
      } else {
        this.terminal.writeln(
          `That command doesn't have an ${DEFAULT_LANG} page.`
        );
      }
    } else {
      this.terminal.writeln(
        `The command "${command}" doesn't have a tldr page.`
      );
    }
  },
};

async function updateCache(target) {
  try {
    let cache = JSON.parse(await request(CACHE_URL));
    target.cacheMapping = new Map();
    for (let command of cache.commands) {
      target.cacheMapping.set(command.name, command);
    }
  } catch (e) {
    throw new Error("Failed to update cache.");
  }
}

async function getCommandInfo(command, platform, language = DEFAULT_LANG) {
  try {
    if (language !== DEFAULT_LANG) {
      return request(`${BASE_URL}.${language}/${platform}/${command}.md`);
    } else {
      return request(`${BASE_URL}/${platform}/${command}.md`);
    }
  } catch (e) {
    throw new Error("Failed to grab command page.");
  }
}

function formatMarkdown(lines) {
  return utils.splitLines(lines).map((line) => {
    if (line.startsWith("#")) {
      return `<span style="color:${colors.cyan}">${utils.strip(
        utils.sanitize(line.replace(/#/g, ""))
      )}</span>`;
    } else {
      line = utils.sanitize(line);
      return line.replace(
        /`[\s\S]+?`/g,
        (l) =>
          `<span style="color:${colors.comment}">${l.replace(/`/g, "")}</span>`
      );
    }
  });
}

export default tldr;
