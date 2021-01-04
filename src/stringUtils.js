/**
 * Parses the arguments for a command. Will return
 * the command as well.
 * @param {String} args raw arguments string
 * @returns {Array} arguments including command
 */
const argParse = (args) => {
  return args.split(/[ ]+/);
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

export default {
  argParse,
  splitLines,
  strip,
  sanitize,
};
