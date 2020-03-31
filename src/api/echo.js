export function handler(event, context, callback) {
  console.log(event);
  callback(null, {
    statusCode: 200,
    body: event.headers["client-ip"]
  });
}
