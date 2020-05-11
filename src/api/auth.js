import { sign } from "./helpers/jwt.js";
import authenticate from "./helpers/authenticate.js";

export async function handler(event) {
  console.log(event);
  if (event.httpMethod === "POST") {
    if (authenticate(event.body)) {
      return {
        statusCode: 200,
        body: sign(),
      };
    } else {
      return {
        statusCode: 401,
        body: "Incorrect password.",
      };
    }
  } else {
    return {
      statusCode: 401,
      body: "Incorrect request.",
    };
  }
}
