const Configs = require('../_shared/configs.js');
const Extend = require('./webpack.extend.js');

const config = {
    currentDir: __dirname,
    metaTags: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
    environment: 'development',
    extensions: ['webos', 'smarttv', 'web'],
    buildFolder: 'public',
    customScripts: [],
    devServerHost: '0.0.0.0',
    baseUrl: '',
    ...Extend
};

const C = Configs.generateConfig(config);

const conf = {
    entry: C.entry,
    devServer: C.devServer,
    output: C.output,
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    module: {
        rules: [C.Rules.babel, C.Rules.css, C.Rules.image, C.Rules.fonts, C.Rules.sourcemap],
    },
    plugins: [C.Plugins.webpack, C.Plugins.html, C.Plugins.harddisk],
    resolve: {
        symlinks: false,
        extensions: C.extensions,
        alias: C.aliases,
    },
};

console.log('config', JSON.stringify(conf, null, 3));

module.exports = conf;
