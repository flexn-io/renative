const webpack = require('webpack'); //to access built-in plugins

const { withRNVWebpack } = require('@rnv/engine-rn-web');

module.exports = withRNVWebpack({
    resolve: {
        alias: {
            'my-module': 'some_path',
        },
        modules: ['test_modules'],
    },
    plugins: [new webpack.ProgressPlugin()],
});
