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
            /metro.config.local.*/
        ])
    },
    projectRoot: path.resolve(__dirname)
};

module.exports = config;
