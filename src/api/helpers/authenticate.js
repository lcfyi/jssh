/**
 * Simple check to verify the passphrase provided.
 */
export default function gateway(phrase) {
  return process.env.PASSPHRASE === phrase;
}
