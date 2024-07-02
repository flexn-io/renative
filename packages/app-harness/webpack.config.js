const webpack = require('webpack'); //to access built-in plugins

const { withRNVWebpack } = require('@rnv/adapter');

module.exports = withRNVWebpack({
    output: {
        chunkFilename: undefined,
        chunkFormat: false,
    },
    resolve: {
        alias: {
            'my-module': 'some_path',
        },
        modules: ['test_modules'],
    },
    plugins: [new webpack.ProgressPlugin()],
});
