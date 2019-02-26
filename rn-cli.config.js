const path = require('path');

const config = {
    projectRoot: path.resolve(__dirname, 'src'),
    watchFolders: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname),
    ],
    modulePaths: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname),
    ],
};

module.exports = config;
