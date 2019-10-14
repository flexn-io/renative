const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');

const config = {
    resolver: {
        blacklistRE: blacklist([
            /platformBuilds\/.*/,
            /buildHooks\/.*/,
            /appConfigs\/.*/,
            /renative.local.*/,
            /packages\/rnv\/.*/,
            /node_modules\/.*\/node_modules\/react-native\/.*/,
        ])
    },
    projectRoot: path.resolve(__dirname),
    watchFolders: [path.resolve(__dirname)]
};

module.exports = config;
