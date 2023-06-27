module.exports = {
    retainLines: true,
    presets: ['@babel/preset-env'],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ['.'],
            },
        ],
    ],
};
