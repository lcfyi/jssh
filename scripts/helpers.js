const fs = require("fs");
const path = require("path");

let getAllFilenames = path => {
  return fs.readdirSync(path);
};

let getFileContents = path => {
  return fs.readFileSync(path, "utf-8");
};

let writeFileContents = (path, data) => {
    return fs.writeFileSync(path, data, "utf-8");
}

let createBackup = path => {
  let contents = getFileContents(path);
  fs.writeFileSync(path + ".bak", contents);
};

let restoreBackup = path => {
  let contents = getFileContents(path + ".bak");
  fs.writeFileSync(path, contents);
};

let deleteBackup = path => {
  fs.unlinkSync(path + ".bak");
};

// This assumes .js file extensions
let generateCommandsObjectString = plugins => {
  let retString = "commands: {";
  plugins.forEach(e => {
    retString += e.slice(0, e.length - 3) + ",";
  });
  retString += "}";
  return retString;
};

let generateImportHeaders = (basePath, plugins) => {
  let retString = "";
  plugins.forEach(e => {
    retString +=
      "import " + e.slice(0, e.length - 3) + ' from "' + basePath + e + '";\n';
  });
  return retString;
};

module.exports = {
  getAllFilenames,
  getFileContents,
  writeFileContents,
  createBackup,
  restoreBackup,
  deleteBackup,
  generateCommandsObjectString,
  generateImportHeaders,
  config: {
    PLUGIN_DIR: path.join(__dirname, "../src/plugins/"),
    PLUGIN_DIR_NAME: "./plugins/",
    TERMPROPS_DIR: path.join(__dirname, "../src/"),
    TERMPROPS_NAME: "termprops.js",
    COMMAND_PLACEHOLDER: "commands: {}"
  }
};
