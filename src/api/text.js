import verify from "./helpers/verify.js";
import sms from "./helpers/sms.js";

export function handler(event, context, callback) {
  console.log(event);
  if (verify(event.headers.authorization)) {
    sms(event.headers.to, event.body).then(
      res => {
        callback(null, {
          statusCode: 200,
          body: res
        });
      },
      rej => {
        callback(null, {
          statusCode: 400,
          body: rej
        });
      }
    );
  } else {
    callback(null, {
      statusCode: 401,
      body: "Not authorized."
    });
  }
}
