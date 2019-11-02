const helpers = require("./helpers.js");

let bootstrap = () => {
  let plugins = helpers.getAllFilenames(helpers.config.PLUGIN_DIR);
  let fileContents = helpers.getFileContents(
    helpers.config.TERMPROPS_DIR + helpers.config.TERMPROPS_NAME
  );
  let imports = helpers.generateImportHeaders(helpers.config.PLUGIN_DIR_NAME, plugins);
  let generatedCommandsList = helpers.generateCommandsObjectString(plugins);

  helpers.createBackup(helpers.config.TERMPROPS_DIR + helpers.config.TERMPROPS_NAME);

  let finalFileContents = (imports + fileContents).replace(
    helpers.config.COMMAND_PLACEHOLDER,
    generatedCommandsList
  );

  helpers.writeFileContents(
    helpers.config.TERMPROPS_DIR + helpers.config.TERMPROPS_NAME,
    finalFileContents
  );
};

bootstrap();
