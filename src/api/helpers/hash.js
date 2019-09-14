import crypto from 'crypto';
import util from 'util';
require('dotenv').config();

/**
 * This function returns the hash based on the seed in env.
 */
export default function hash() {
    let seed = new util.TextEncoder('utf-8').encode(process.env.HASH_SEED);
    return crypto.createHmac('sha256', seed).update('update').digest('hex');
}