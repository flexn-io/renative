const path = require('path');
const { withRNV } = require('@rnv/engine-rn');

const defaultConfig = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
            // this defeats the RCTDeviceEventEmitter is not a registered callable module
                inlineRequires: true,
            },
        }),
    },
    watchFolders: [
        path.resolve(__dirname, '../renative')
    ]
};

module.exports = withRNV(defaultConfig);
