require('dotenv').config();

/**
 * This function acts as the gateway that verifies
 * the input phrase as the one we accept.
 */
export default function gateway(phrase) {
    return process.env.PASSPHRASE === phrase;
}