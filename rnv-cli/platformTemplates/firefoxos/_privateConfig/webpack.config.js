const Configs = require('../_shared/configs.js');

const config = {
    metaTags: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
    environment: 'production',
    extensions: ['firefoxos', 'firefox', 'web'],
};

const C = Configs.generateConfig(__dirname, config);

module.exports = {
    entry: C.entry,
    devServer: C.devServer,
    output: C.output,
    module: {
        rules: [
            C.Rules.babel,
            C.Rules.css,
            C.Rules.image,
            C.Rules.ttf,
            C.Rules.sourcemap,
        ],
    },
    plugins: [
        C.Plugins.webpack,
        C.Plugins.html,
        C.Plugins.harddisk,
    ],
    resolve: {
        symlinks: false,
        extensions: C.extensions,
        alias: C.aliases,
    },
};
