import { verify } from "./helpers/jwt.js";
import sms from "./helpers/sms.js";

export function handler(event, context, callback) {
  console.log(event);
  if (event.httpMethod === "POST") {
    try {
      verify(event.headers.authorization);
      sms(event.headers.to, event.body).then(
        (res) => {
          callback(null, {
            statusCode: 200,
            body: res,
          });
        },
        (rej) => {
          callback(null, {
            statusCode: 400,
            body: rej,
          });
        }
      );
    } catch (e) {
      callback(null, {
        statusCode: 401,
        body: `${e.message.charAt(0).toUpperCase()}${e.message.slice(1)}.`,
      });
    }
  } else {
    callback(null, {
      statusCode: 401,
      body: "Incorrect request.",
    });
  }
}
