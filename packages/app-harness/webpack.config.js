const webpack = require('webpack'); //to access built-in plugins

const { withRNVWebpack } = require('@rnv/adapter');

module.exports = withRNVWebpack({
    resolve: {
        alias: {
            'my-module': 'some_path',
        },
        modules: ['test_modules'],
    },
    plugins: [new webpack.ProgressPlugin()],
});
