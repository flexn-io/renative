// const cleanAliases = require('./platforms/common/pathAliases');

module.exports = {
    retainLines: true,
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['.'],
            },
        ],
    ],
};
