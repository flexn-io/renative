const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
    presets: [
        ["@babel/preset-react", {
            "runtime": "automatic"
        }]
    ],
    babelrc: false,
    configFile: false,
});
