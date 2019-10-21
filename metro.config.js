const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const buildConfig = require('./platfromBuilds/renative.build.json');

const config = {
    resolver: {
        sourceExts: buildConfig._sourceExt,
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
    // watchFolders: [path.resolve(__dirname)]
};

module.exports = config;
