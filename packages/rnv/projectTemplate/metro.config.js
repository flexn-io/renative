const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const { doResolve } = require('rnv');
const sourceExts = require('./metro.config.local');

const defaultConfig = {
    resolver: {
        sourceExts,
        blacklistRE: blacklist([
            /platformBuilds\/.*/,
            /buildHooks\/.*/,
            /projectConfig\/.*/,
            /appConfigs\/.*/,
            /renative.local.*/,
            /metro.config.local.*/
        ]),
        extraNodeModules: {
            'react-native': doResolve('react-native'),
            'react-navigation': doResolve('react-navigation')
        }
    },
    watchFolders: [
        path.resolve(__dirname, '../../node_modules'),
        path.resolve(__dirname, './node_modules'),
        path.resolve(__dirname, '../renative')
    ],
    projectRoot: path.resolve(__dirname)
};

module.exports = defaultConfig;
