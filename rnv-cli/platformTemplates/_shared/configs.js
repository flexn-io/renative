const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


function generateConfig(appDir, config) {
    const projectDir = path.resolve(appDir, '../../');
    const platformBuildsDir = path.resolve(appDir, '../');
    const platformBuildsSharedDir = path.join(platformBuildsDir, '_shared');
    const appBuildDir = path.resolve(appDir);
    const appBuildPublicDir = path.resolve(appDir, 'public');

    const rules = {};
    rules.babel = {
        test: /\.js$/,
        include: [
            path.resolve(projectDir, 'src'),
        ],
        use: {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                presets: [
                    ['module:metro-react-native-babel-preset'],
                ],
            },
        },
    };

    rules.css = {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
        })),
    };

    rules.image = {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
            loader: 'react-native-web-image-loader',
        },
    };

    rules.ttf = {
        test: /\.(ttf)(\?[\s\S]+)?$/,
        use: 'file-loader',
    };

    rules.sourcemap = {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
    };

    const aliases = {
        react: path.resolve(projectDir, 'node_modules/react'),
        'react-native': 'react-native-web',
        'react-native-linear-gradient': 'react-native-web-linear-gradient',
        'react-native-vector-icons': 'react-native-web-vector-icons',
    };

    const plugins = {};

    plugins.webpack = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(config.environment),
        __DEV__: process.env.NODE_ENV === 'production' || true,
    });
    plugins.html = new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: path.resolve(appBuildPublicDir, './index.html'),
        template: path.resolve(platformBuildsSharedDir, './template.js'),
        minify: false,
        templateParameters: {
            ...config,
        },
    });
    plugins.harddisk = new HtmlWebpackHarddiskPlugin();

    const extensions = config.extensions.map(v => `.${v}.js`).concat(['.js']);

    const output = {
        filename: '[name].js',
        publicPath: 'assets/',
        path: path.join(appBuildPublicDir, 'assets'),
    };

    const devServer = {
        host: '0.0.0.0',
    };

    const entry = {
        fetch: 'whatwg-fetch',
        polyfill: 'babel-polyfill',
        bundle: path.resolve(projectDir, `index.${config.extensions[0]}.js`),
    };

    return {
        Rules: rules,
        Plugins: plugins,
        extensions,
        aliases,
        entry,
        devServer,
        output,
        projectDir,
        platformBuildsDir,
        appBuildDir,
        appBuildPublicDir,
        platformBuildsSharedDir,
    };
}


module.exports = {
    generateConfig,
};
