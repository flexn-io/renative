const { withRNV } = require('@rnv/engine-rn-next');

const config = {
    compress: false,
    experimental: {
        forceSwcTransforms: true,
    },
};

module.exports = withRNV(config);
