// const cleanAliases = require('./platforms/common/pathAliases');

module.exports = {
    presets: ['@expo/next-adapter/babel'],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['.'],
                alias: {
                    renative: './node_modules/renative'
                }
            },
        ],
    ],
};
