const webpack = require('webpack'); //to access built-in plugins

const { withRNV } = require('@rnv/engine-rn-web');

module.exports = withRNV({
    resolve: {
        alias: {
            'my-module': 'some_path',
        },
        modules: ['test_modules'],
    },
    plugins: [new webpack.ProgressPlugin()],
});
