module.exports = {
    retainLines: true,
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        'transform-react-remove-prop-types',
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['..']
            },
        ],
    ],
};
