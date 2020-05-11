export async function handler(event) {
  console.log(event);
  return {
    statusCode: 200,
    body: event.headers["client-ip"],
  };
}
