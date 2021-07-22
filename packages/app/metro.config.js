const path = require('path');
const { withRNV } = require('@rnv/engine-rn');

const defaultConfig = {
    watchFolders: [
        path.resolve(__dirname, '../renative')
    ],
    // TODO: needed specifically for macOS platform. Move it to separate config which will be used only when macOS platform is needed
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

module.exports = withRNV(defaultConfig);
