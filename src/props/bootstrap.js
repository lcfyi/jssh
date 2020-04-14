const helpers = require("./helpers.js");
const path = require("path");

module.exports = () => {
  // Grab the raw contents of termProps
  let propsContent = helpers.getFileContents(
    path.join(__dirname, "termprops.js")
  );

  // Get all the plugins available
  let plugins = helpers.getAllFilenames(path.join(__dirname, "../plugins"));

  // Generate the final code that includes the headers, file contents,
  // and commands object replaced properly
  return {
    code: (
      helpers.generateImportHeaders("../plugins/", plugins) + propsContent
    ).replace("commands: {}", helpers.generateCommandsObjectString(plugins))
  };
};
