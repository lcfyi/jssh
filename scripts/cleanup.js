const helpers = require("./helpers.js");

let cleanup = () => {
    helpers.restoreBackup(helpers.config.TERMPROPS_DIR + helpers.config.TERMPROPS_NAME);
    helpers.deleteBackup(helpers.config.TERMPROPS_DIR + helpers.config.TERMPROPS_NAME);
}

cleanup();