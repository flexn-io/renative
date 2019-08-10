const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const config = {
    projectRoot: path.resolve(__dirname),
    watchFolders: [path.resolve(__dirname)],
    modulePaths: [path.resolve(__dirname)],
    resolver: {
        blacklistRE: blacklist([
            /node_modules\/.*\/node_modules\/react-native\/.*/,
        ])
    }
};

module.exports = config;
