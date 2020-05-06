const fs = require("fs");

let getAllFilenames = (path) => {
  return fs.readdirSync(path);
};

let getFileContents = (path) => {
  return fs.readFileSync(path, "utf-8");
};

// This assumes .js file extensions
let generateCommandsObjectString = (plugins) => {
  let retString = "commands: {";
  plugins.forEach((e) => {
    retString += e.slice(0, e.length - 3) + ",";
  });
  retString += "}";
  return retString;
};

let generateImportHeaders = (basePath, plugins) => {
  let retString = "";
  plugins.forEach((e) => {
    retString +=
      "import " + e.slice(0, e.length - 3) + ' from "' + basePath + e + '";\n';
  });
  return retString;
};

module.exports = {
  getAllFilenames,
  getFileContents,
  generateCommandsObjectString,
  generateImportHeaders,
};
