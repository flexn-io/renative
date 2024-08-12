const webpack = require('webpack'); //to access built-in plugins

const { withRNVWebpack } = require('@rnv/adapter');

module.exports = withRNVWebpack({
    output: {
        //This allows to build and output a single JS file
        //https://github.com/flexn-io/renative/issues/1353
        // chunkFormat: false,
    },
    resolve: {
        alias: {
            'my-module': 'some_path',
        },
        modules: ['test_modules'],
    },
    plugins: [new webpack.ProgressPlugin()],
});
