const path = require('path');
const { withRNVMetro } = require('rnv');

const defaultConfig = {
    watchFolders: [
        path.resolve(__dirname, '../renative')
    ],
};

module.exports = withRNVMetro(defaultConfig);
