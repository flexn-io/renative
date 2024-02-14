const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    resolve: {
        alias: {
            'my-module': 'some_path',
        },
        modules: ['test_modules'],
    },
    plugins: [new webpack.ProgressPlugin()],
};
