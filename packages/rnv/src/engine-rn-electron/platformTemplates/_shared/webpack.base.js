const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function generateConfig(config) {
    const projectDir = path.resolve(__dirname, '../..');
    const appBuildDir = path.resolve(__dirname);
    const appBuildPublicDir = path.resolve(appBuildDir, config.buildFolder || '');

    const baseUrl = config.baseUrl || '';
    config.linkTags = [
        `<link rel="manifest" href="${baseUrl}manifest.json" />`,
        `<link rel="shortcut icon" href="${baseUrl}favicon.ico" />`,
        `<link rel="stylesheet" href="${baseUrl}app${config.assetVersion}.css" />`
    ];

    const devServerHost = config.devServerHost || '0.0.0.0';

    const rules = {};
    rules.babel = {
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        include: config.modulePaths,
        use: {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                plugins: ['@babel/plugin-proposal-class-properties'],
                presets: ['module:metro-react-native-babel-preset', ['@babel/preset-env', {
                    forceAllTransforms: true,
                    targets: 'Samsung 4',
                    spec: true,
                }]],
            },
        },
    };

    rules.css = {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(
            {
                loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
        ),
    };

    rules.image = {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
            loader: 'react-native-web-image-loader',
        },
    };

    rules.fonts = {
        test: /\.(woff|woff2|eot|ttf|otf)(\?[\s\S]+)?$/,
        use: 'file-loader',
    };

    rules.sourcemap = {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [/node_modules/, /build/, /__test__/]
    };

    const plugins = {};

    plugins.webpack = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(config.environment),
        __DEV__: config.environment === 'production' || true,
    });

    plugins.html = new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: path.resolve(appBuildPublicDir, './index.html'),
        template: path.resolve(appBuildDir, './template.js'),
        minify: false,
        templateParameters: {
            ...config,
            debug: process.env.DEBUG,
            debugIp: process.env.DEBUG_IP,
            remoteDebugScript: process.env.DEBUG_SCRIPT,
            debugPort: process.env.DEBUG_PORT,
            platform: process.env.PLATFORM,
            environment: config.environment,
        },
    });

    plugins.harddisk = new HtmlWebpackHarddiskPlugin();

    plugins.analyzer = new BundleAnalyzerPlugin();

    plugins.css = new MiniCssExtractPlugin();

    const extensions = config.extensions.map(v => `.${v}`);

    const output = {
        filename: `[name]${config.assetVersion}.js`,
        publicPath: `${baseUrl}assets/`,
        path: path.join(appBuildPublicDir, 'assets'),
    };

    const devServer = {
        host: devServerHost,
    };

    const entry = {
        fetch: 'whatwg-fetch',
        polyfill: 'babel-polyfill',
        bundle: path.resolve(projectDir, `${config.entryFile}.js`),
    };

    return {
        Rules: rules,
        Plugins: plugins,
        extensions,
        aliases: config.moduleAliases,
        entry,
        devServer,
        output,
        projectDir,
        appBuildDir,
        appBuildPublicDir
    };
}

module.exports = {
    generateConfig,
};
