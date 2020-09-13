module.exports = {
    retainLines: true,
    presets: ['module:metro-react-native-babel-preset'],
    ignore: [
        'src/engine-rn/platformTemplates',
        'src/engine-rn-web/platformTemplates',
        'src/engine-rn-electron/platformTemplates',
        'src/engine-rn-next/platformTemplates'
    ],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['.']
            },
        ],
    ],
};
