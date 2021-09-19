/**
 * Parses the arguments for a command. Will return
 * the command as well.
 * @param {String} args raw arguments string
 * @returns {Array} arguments including command
 */
const argParse = (args) => {
  return args.replace(/^\s+|\s+$/g, "").split(/[ ]+/);
};

/**
 * Split lines.
 * @param {String} lines raw string
 * @returns {Array} split lines
 */
const splitLines = (lines) => {
  return lines.split(/\r\n|\r|\n/);
};

/**
 * Alphanumeric testing.
 * @param {String} string
 * @returns {Boolean} whether the string is alphanumeric
 */
const isAlphaNumeric = (string) => {
  for (let i = 0; i < string.length; i++) {
    const chr = string.charAt(i);
    if (
      !(chr >= "0" && chr <= "9") &&
      !(chr >= "a" && chr <= "z") &&
      !(chr >= "A" && chr <= "Z")
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Strip whitespace from lines.
 * @param {String} string raw string
 * @returns {String} modified string
 */
const strip = (string) => {
  return string.replace(/^\s+|\s+$/g, "");
};

/**
 * Sanitizes a string.
 * @param {String} string raw string
 * @returns {String} sanitized string
 */
const sanitize = (string) => {
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Async sleep.
 * @param {Number} time to sleep in ms
 */
const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export default {
  argParse,
  splitLines,
  isAlphaNumeric,
  strip,
  sanitize,
  sleep,
};
