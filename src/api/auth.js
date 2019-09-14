import hash from './helpers/hash.js';
import gateway from './helpers/gateway.js';

export function handler(event, context, callback) {
    if (gateway(event.body)) {
        callback(null, {
            statusCode: 200,
            body: hash()
            });
    } else {
        callback(null, {
            statusCode: 401,
            body: "Incorrect password."
        });
    }
}
