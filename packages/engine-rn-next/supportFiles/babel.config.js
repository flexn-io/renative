module.exports = {
    retainLines: true,
    presets: ['module:babel-preset-expo'],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['..'],
            },
        ],
    ],
};
