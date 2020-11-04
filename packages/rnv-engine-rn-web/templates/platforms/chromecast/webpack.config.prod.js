const Configs = require('./webpack.base.js');
const Extend = require('./webpack.extend.js');

const config = {
    currentDir: __dirname,
    metaTags: { viewport: 'content="width=device-width, initial-scale=1, shrink-to-fit=no"' },
    environment: 'production',
    ...Extend
};

const C = Configs.generateConfig(config);
const plugins = [C.Plugins.webpack, C.Plugins.html, C.Plugins.harddisk, C.Plugins.css];
if (config.analyzer) plugins.push(C.Plugins.analyzer);

console.log(JSON.stringify({
    entry: C.entry,
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
}, null, 3));

module.exports = {
    entry: C.entry,
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
