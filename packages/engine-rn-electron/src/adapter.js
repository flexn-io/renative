export const withRNVBabel = cnf => ({
    retainLines: true,
    // presets: ['module:metro-react-native-babel-preset'],
    presets: ['module:babel-preset-expo'],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: [process.env.RNV_MONO_ROOT || '.'],
            },
        ],
    ],
    ...cnf
});
