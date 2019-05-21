const path = require('path');

const config = {
    projectRoot: path.resolve(__dirname),
    watchFolders: [path.resolve(__dirname)],
    modulePaths: [path.resolve(__dirname)],
};

module.exports = config;
