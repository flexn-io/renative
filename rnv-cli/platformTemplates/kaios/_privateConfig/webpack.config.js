const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../../');
const platformBuildsDir = path.resolve(__dirname, '../');
const appBuildDirectory = path.resolve(__dirname);
const appBuildPublic = path.resolve(__dirname, 'public');
const platform = 'kaios';
const platformFamily = 'jsapp';
const formFactor = 'mobile';
const platformFallback = 'web';
const config = { metaTags: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' } };

const babelLoaderConfiguration = {
    test: /\.js$/,
    include: [
        path.resolve(appDirectory, 'src'),
        path.resolve(appDirectory, 'entry'),

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

const cssLoaderConfiguration = {
    test: /\.css$/,
    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
    })),
};

const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'react-native-web-image-loader',
    },
};

const ttfLoaderConfiguration = {
    test: /\.(ttf)(\?[\s\S]+)?$/,
    use: 'file-loader',
};

const sourcemapLoaderConfiguration = {
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre',
};

module.exports = {
    entry: {
        fetch: 'whatwg-fetch',
        polyfill: 'babel-polyfill',
        bundle: path.resolve(appDirectory, `index.${platform}.js`),
    },

    devServer: config.devServer || {
        host: '0.0.0.0',
    },

    output: {
        filename: '[name].js',
        publicPath: 'assets/',
        path: path.resolve(appBuildDirectory, './public/assets'),
    },

    module: {
        rules: [
            babelLoaderConfiguration,
            cssLoaderConfiguration,
            imageLoaderConfiguration,
            ttfLoaderConfiguration,
            sourcemapLoaderConfiguration,
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            __DEV__: process.env.NODE_ENV === 'production' || true,
        }),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            filename: path.resolve(appBuildPublic, './index.html'),
            template: path.resolve(platformBuildsDir, './_shared/template.js'),
            minify: false,
            templateParameters: {
                ...config,
            },
        }),
        new HtmlWebpackHarddiskPlugin(),
    ],
    resolve: {
        symlinks: false,
        extensions: [
            `.${platform}.js`,
            `.${platformFamily}.js`,
            // `.${formFactor}.js`,
            `.${platformFallback}.js`,
            '.js',
        ],
        alias: {

            react: path.resolve(appDirectory, 'node_modules/react'),
            'react-native': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient',
            'react-native-vector-icons': 'react-native-web-vector-icons',
        },
    },
};
