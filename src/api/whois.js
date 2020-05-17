const whois = require("whois-json");

function sanitizeUrl(url) {
  if (url.includes("://")) {
    url = url.split("://")[1];
  }
  url = url.replace("/", "");
  let fragments = url.split(".");
  return [
    fragments[fragments.length - 2],
    fragments[fragments.length - 1],
  ].join(".");
}

export async function handler(event) {
  console.log(event);
  if (event.httpMethod === "POST") {
    try {
      let result = await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("Timed out.");
        }, 9000);
        whois(sanitizeUrl(event.body)).then((result) => {
          resolve(result);
        });
      });
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (e) {
      return {
        statusCode: 401,
        body: e,
      };
    }
  } else {
    return {
      statusCode: 401,
      body: "Incorrect request.",
    };
  }
}
