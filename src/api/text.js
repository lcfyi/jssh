import { verify } from "./helpers/jwt.js";
import sms from "./helpers/sms.js";

export async function handler(event) {
  console.log(event);
  if (event.httpMethod === "POST") {
    try {
      verify(event.headers.authorization);
      let result = await sms(event.headers.to, event.body);
      return {
        statusCode: 200,
        body: result,
      };
    } catch (e) {
      return {
        statusCode: 401,
        body: `${e.message.charAt(0).toUpperCase()}${e.message.slice(1)}.`,
      };
    }
  } else {
    return {
      statusCode: 401,
      body: "Incorrect request.",
    };
  }
}
