// web/webpack.config.js

const path = require('path');
const webpack = require('webpack');

const projectDirectory = path.resolve(__dirname, '../../');
const appDirectory = path.resolve(__dirname);

const babelLoaderConfiguration = {
    test: /\.js$/,
    include: [
        path.resolve(projectDirectory, 'src'),
        path.resolve(projectDirectory, 'node_modules/react-navigation'),
        path.resolve(projectDirectory, 'node_modules/react-native-tab-view'),
        path.resolve(projectDirectory, 'node_modules/react-native-paper'),
        path.resolve(projectDirectory, 'node_modules/react-native-vector-icons'),
        path.resolve(projectDirectory, 'node_modules/react-native-safe-area-view'),
        path.resolve(projectDirectory, 'node_modules/react-native-platform-touchable'),
    ],
    use: {
        loader: 'babel-loader',
        options: {
            babelrc: false,
            plugins: [
                'react-native-web',
                'transform-decorators-legacy',
                ['transform-runtime', { helpers: false, polyfill: false, regenerator: true }],
            ],
            presets: ['react-native-stage-0'],
        },
    },
};

const cssLoaderConfiguration = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
};

const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'react-native-web-image-loader',
    },
};

const ttfLoaderConfiguration = {
    test: /\.ttf$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: './fonts/[hash].[ext]',
            },
        },
    ],
    include: [
        path.resolve(projectDirectory, './src/assets/fonts'),
        path.resolve(projectDirectory, 'node_modules/react-native-vector-icons'),
    ],
};

module.exports = {
    entry: path.resolve(projectDirectory, './index.tizen.js'),
    devtool: 'eval',

    output: {
        filename: 'bundle.js',
        publicPath: '/assets/',
        path: path.resolve(appDirectory, 'public/assets'),
    },

    module: {
        rules: [
            babelLoaderConfiguration,
            cssLoaderConfiguration,
            imageLoaderConfiguration,
            ttfLoaderConfiguration,
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            __DEV__: process.env.NODE_ENV === 'production' || true,
        }),
    ],

    resolve: {
        symlinks: false,
        extensions: ['.tizen.js', '.js'],
    },
};
