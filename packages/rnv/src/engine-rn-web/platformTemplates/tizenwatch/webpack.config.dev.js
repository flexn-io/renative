const Configs = require('./webpack.base.js');
const Extend = require('./webpack.extend.js');

const config = {
    currentDir: __dirname,
    metaTags: { viewport: 'content="width=200"' },
    environment: 'development',
    customScripts: [],
    devServerHost: '0.0.0.0',
    baseUrl: '',
    ...Extend
};

const C = Configs.generateConfig(config);
const plugins = [C.Plugins.webpack, C.Plugins.html, C.Plugins.harddisk, C.Plugins.css];
if (config.analyzer) plugins.push(C.Plugins.analyzer);

module.exports = {
    entry: C.entry,
    devServer: C.devServer,
    output: C.output,
    module: {
        rules: [C.Rules.babel, C.Rules.css, C.Rules.image, C.Rules.fonts, C.Rules.sourcemap],
    },
    plugins,
    resolve: {
        symlinks: false,
        extensions: C.extensions,
        alias: C.aliases,
    },
    ...config.extend || {}
};
