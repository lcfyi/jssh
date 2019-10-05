import hash from './helpers/hash.js';
import gateway from './helpers/gateway.js';
require('dotenv').config();

export function handler(event, context, callback) {
    console.log(event);
    if (gateway(event.body)) {
        callback(null, {
            statusCode: 200,
            body: hash()
            });
    } else {
        callback(null, {
            statusCode: 401,
            body: process.env.PASSPHRASE
        });
    }
}
