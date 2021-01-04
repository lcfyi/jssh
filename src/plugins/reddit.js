import request from "../request.js";
import colors from "../colors.js";

const listPrinter = (term, values) => {
  let maxCount = values.reduce(
    (prev, curr) =>
      prev > curr.subreddit.length ? prev : curr.subreddit.length,
    0
  );
  console.log(maxCount);
  term.writeln(
    `<span style='color:${colors.red}'>Subreddit${" ".repeat(
      maxCount - "Subreddit".length
    )} Count</span>`,
    true
  );
  values.forEach((sub) => {
    term.writeln(
      `${sub.subreddit}${" ".repeat(maxCount - sub.subreddit.length)} ${
        sub.length
      }`
    );
  });
};

const naiveSanitize = (str) => {
  return str.replace("<", "&lt;").replace(">", "&gt;");
};

// We do this way to prevent the browser from batching DOM updates,
// making it feel more snappy and interactive (like a scrolling tty)
const longPrinter = (values, handler) => {
  let promises = [];
  values.forEach((value, index) => {
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          handler(value, index);
          resolve();
        }, 0);
      })
    );
  });
  return Promise.all(promises);
};

const reddit = {
  description: "contains several reddit browsing methods",
  help: [
    "Usage",
    "",
    "reddit [username]",
    "Types of bases are 0x for hex, 0b for binary, and 0o for octal.",
  ],
  async function(e) {
    let username = e.split(/[ ]+/)[1];
    if (!username) {
      this.terminal.writeln("You have to provide a username!");
      return;
    }
    let subreddits = {};
    let comments = [];
    let links = [];
    let sorted = [];

    let after;
    let page = 1;
    this.terminal.writeln(`Scraping user: ${username}`);
    try {
      do {
        this.terminal.writeln(
          `<span style='color:${colors.comment}'>Fetching page ${page++}..</span>`,
          true
        );
        let response = JSON.parse(
          await request(`https://reddit.com/u/${username}.json`, {
            // timeout: 7000,
            queryParams: {
              after: after,
              limit: 100,
            },
            hideCors: true,
          })
        );
        after = response.data.after;
        response.data.children.forEach((c) => {
          let karma = c.data.ups;
          let link = "https://old.reddit.com" + c.data.permalink;
          let kind;
          let meta;
          switch (c.kind) {
            case "t1":
              kind = "comment";
              meta = c.data.body;
              comments.push({ meta, link });
              break;
            case "t3":
              kind = "link";
              meta = c.data.title;
              links.push({ meta, link });
              break;
          }
          if (!(c.data.subreddit in subreddits)) {
            subreddits[c.data.subreddit] = [];
          }
          subreddits[c.data.subreddit].push({
            karma,
            kind,
            meta,
            link,
          });
        });
      } while (after);
      this.terminal.writeln("Done! Type 'help' to see what you can now do.");
    } catch (e) {
      this.terminal.writeln(`Error: ${e ? e : "No response."}`);
      return;
    }

    for (let subreddit in subreddits) {
      sorted.push({ subreddit, length: subreddits[subreddit].length });
    }
    sorted.sort((a, b) => b.length - a.length);

    while (true) {
      let input = await this.terminal.input(
        `<span style='color:${colors.green}'>reddit:</span><span style='color:${colors.cyan}'>/user/${username}</span>$ `
      );
      input = input.split(" ").filter((e) => e);
      let command = input[0];
      let modifiers = input.slice(1);

      switch (command) {
        case "count":
          switch (modifiers[0]) {
            case "comment":
            case "comments":
              this.terminal.writeln(`Total comments: ${comments.length}`);
              break;
            case "link":
            case "links":
              this.terminal.writeln(`Total links: ${links.length}`);
              break;
            default:
              this.terminal.writeln("This command needs a valid modifier.");
          }
          break;
        case "raw":
          switch (modifiers[0]) {
            case "comment":
            case "comments":
              await longPrinter(comments, (comment, index) => {
                this.terminal.writeln({
                  text: `Comment #${index + 1}`,
                  color: colors.yellow,
                });
                this.terminal.writeln(comment.meta);
                this.terminal.writeln(
                  `<a target="_blank" href="${comment.link}">source</a>`,
                  true
                );
                this.terminal.writeln();
              });
              break;
            case "link":
            case "links":
              await longPrinter(links, (link, index) => {
                this.terminal.writeln({
                  text: `Link #${index + 1}`,
                  color: colors.yellow,
                });
                this.terminal.writeln(link.meta);
                this.terminal.writeln(
                  `<a target="_blank" href="${link.link}">source</a>`,
                  true
                );
                this.terminal.writeln();
              });
              break;
            default:
              this.terminal.writeln("This command needs a valid modifier.");
          }
          break;
        case "subreddits":
          listPrinter(this.terminal, sorted);
          break;
        case "help":
          this.terminal.writeln("Not yet implemented.");
          break;
        case "find":
          switch (modifiers[0]) {
            case "comment":
            case "comments": {
              let regex = new RegExp(`(${modifiers[1]})`, "ig");
              await longPrinter(
                comments.filter((e) =>
                  e.meta.toLowerCase().includes(modifiers[1].toLowerCase())
                ),
                (comment, index) => {
                  this.terminal.writeln({
                    text: `Comment #${index + 1}`,
                    color: colors.yellow,
                  });
                  this.terminal.writeln(
                    naiveSanitize(comment.meta).replace(
                      regex,
                      `<span style='color:${colors.red}'>$1</span>`
                    ),
                    true
                  );
                  this.terminal.writeln(
                    `<a target="_blank" href="${comment.link}">source</a>`,
                    true
                  );
                  this.terminal.writeln();
                }
              );
              break;
            }
            case "link":
            case "links":
              await longPrinter(
                links.filter((e) => e.meta.includes(modifiers[1])),
                (link, index) => {
                  this.terminal.writeln({
                    text: `Link #${index + 1}`,
                    color: colors.yellow,
                  });
                  this.terminal.writeln(link.meta);
                  this.terminal.writeln(
                    `<a target="_blank" href="${link.link}">source</a>`,
                    true
                  );
                  this.terminal.writeln();
                }
              );
              break;
            default:
              this.terminal.writeln("This command needs a valid modifier.");
          }
          break;
        case "quit":
          return;
        default:
          this.terminal.writeln(
            "Invalid input. Type 'help' for help and 'quit' to quit."
          );
      }
    }
  },
};

export default reddit;
