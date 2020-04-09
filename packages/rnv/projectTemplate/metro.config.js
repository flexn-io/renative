const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const sourceExts = require('./metro.config.local');

const config = {
    resolver: {
        sourceExts,
        blacklistRE: blacklist([
            /platformBuilds\/.*/,
            /buildHooks\/.*/,
            /appConfigs\/.*/,
            /renative.local.*/,
            /packages\/rnv\/.*/,
            /metro.config.local.*/
            /node_modules\/.*\/node_modules\/react-native\/.*/
        ])
    },
    projectRoot: path.resolve(__dirname)
};

module.exports = config;
