// const cleanAliases = require('./platforms/common/pathAliases');
// const path = require('path');

module.exports = {
    presets: ['@expo/next-adapter/babel'],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['.'],
                // alias: {
                //     renative: path.resolve(__dirname, '../packages/renative')
                // }
            },
        ],
    ],
};
