const path = require('path');
const { withRNV } = require('@rnv/engine-rn-windows');

const defaultConfig = {
    watchFolders: [
        path.resolve(__dirname, '../renative')
    ],
};

module.exports = withRNV(defaultConfig);
