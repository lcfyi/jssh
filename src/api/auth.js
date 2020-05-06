import { sign } from "./helpers/jwt.js";
import authenticate from "./helpers/authenticate.js";

export function handler(event, context, callback) {
  console.log(event);
  if (event.httpMethod === "POST") {
    if (authenticate(event.body)) {
      callback(null, {
        statusCode: 200,
        body: sign()
      });
    } else {
      callback(null, {
        statusCode: 401,
        body: "Incorrect password."
      });
    }
  } else {
    callback(null, {
      statusCode: 401,
      body: "Incorrect request."
    });
  }
}
