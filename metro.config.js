const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const sourceExts = require('./metro.config.local');

const config = {
    resolver: {
        sourceExts,
        blacklistRE: blacklist([
            /platformBuilds\/.*/,
            /buildHooks\/.*/,
            /projectConfig\/.*/,
            /website\/.*/,
            /appConfigs\/.*/,
            /renative.local.*/,
            /metro.config.local.*/,
            /packages\/rnv\/.*/,
            /packages\/rnv-deploy-docker\/.*/,
            /packages\/renative-template-hello-world\/.*/,
            /packages\/renative-template-kitchen-sink\/.*/,
            /packages\/renative-template-blank\/.*/
        ])
    },
    projectRoot: path.resolve(__dirname),
};

module.exports = config;
