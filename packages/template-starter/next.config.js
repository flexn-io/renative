const { withRNV } = require('@rnv/engine-rn-next');

const config = {
    compress: false,
    experimental: {
        forceSwcTransforms: false,
    },
};

module.exports = withRNV(config);
