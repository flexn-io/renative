const { withRNVBabel } = require('@rnv/adapter');

module.exports = withRNVBabel({
    presets: ['@babel/preset-env', '@babel/preset-react', 'module:@react-native/babel-preset'],
    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs'],
});
