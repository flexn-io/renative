const { withRNV } = require('@rnv/engine-rn-next');
const path = require('path');

const config = {
    projectRoot: path.resolve(__dirname),
    compress: false
};

module.exports = withRNV(config);
