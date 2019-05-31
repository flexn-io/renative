const Configs = require('../_shared/configs.js');
const Extend = require('./webpack.extend.js');

const config = {
    currentDir: __dirname,
    metaTags: { viewport: 'content="width=200"' },
    environment: 'development',
    extensions: ['tizenwatch', 'smarttv', 'web'],
    customScripts: [],
    devServerHost: '0.0.0.0',
    baseUrl: '',
    ...Extend
};

const C = Configs.generateConfig(config);

module.exports = {
    entry: C.entry,
    devServer: C.devServer,
    output: C.output,
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
