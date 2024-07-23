const { withRNVWebpack } = require('@rnv/adapter');

module.exports = withRNVWebpack({
    output: {
        //This allows to build and output a single bundle.js file
        //https://github.com/flexn-io/renative/issues/1353
        // chunkFormat: false,
    },
});
