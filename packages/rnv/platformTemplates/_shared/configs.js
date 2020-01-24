const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function generateConfig(config) {
    const projectDir = path.resolve(config.currentDir, '../../');
    const platformBuildsDir = path.resolve(config.currentDir, '../');
    const platformBuildsSharedDir = path.join(platformBuildsDir, '_shared');
    const appBuildDir = path.resolve(config.currentDir);
    const appBuildPublicDir = path.resolve(config.currentDir, config.buildFolder || 'public');

    const baseUrl = config.baseUrl || '';
    const devServerHost = config.devServerHost || '0.0.0.0';

    const modulePaths = [
        'index.webos.js',
        'index.tizen.js',
        'src',
        'packages',
        'node_modules/react-native-screens',
        'node_modules/react-navigation-tabs',
        'node_modules/react-navigation-stack',
        'node_modules/react-navigation',
        'node_modules/@react-navigation',
        'node_modules/react-native-gesture-handler',
        'node_modules/react-native-reanimated',
        'node_modules/react-native-camera',
        'node_modules/react-native-actionsheet',
        'node_modules/react-native-root-toast',
        'node_modules/react-native-root-siblings',
        'node_modules/static-container',
        'node_modules/react-native-material-dropdown',
        'node_modules/react-native-material-buttons',
        'node_modules/react-native-material-textfield',
        'node_modules/react-native-material-ripple',
        'node_modules/react-native-easy-grid',
        'node_modules/native-base-shoutem-theme',
        'node_modules/react-native-drawer',
        'node_modules/react-native-safe-area-view',
        'node_modules/react-native-vector-icons',
        'node_modules/react-native-keyboard-aware-scroll-view',
        'node_modules/react-native-tab-view',
        'node_modules/query-string',
        'node_modules/split-on-first',
        'node_modules/strict-uri-encode',
        'node_modules/@react-navigation/core',
        'node_modules/@react-navigation/web',
        'node_modules/react-native-animatable',
        'node_modules/react-native-collapse-view',
        'node_modules/react-native-color-picker',
        'node_modules/react-native-ios-picker',
        'node_modules/react-native-modal-datetime-picker',
        'node_modules/react-native-modal',
        'node_modules/react-native-paper',
        'node_modules/react-native-animatable',
        'node_modules/react-native-collapse-view',
        'node_modules/react-native-color-picker',
        'node_modules/react-native-ios-picker',
        'node_modules/react-native-modal-datetime-picker/',
        'node_modules/react-native-modal',
        'node_modules/react-native-paper',
        'node_modules/react-native-platform-touchable',
        'node_modules/react-native-safe-area-view',
        'node_modules/react-native-super-grid',
        'node_modules/react-native-tab-view',
        'node_modules/react-native-vector-icons',
        'node_modules/react-native-simple-markdown',
        'node_modules/react-native-swipe-gestures',
        'node_modules/react-native-switch',
        'node_modules/react-native-orientation-locker',
        'node_modules/react-navigation',
        'node_modules/@react-navigation/native',
        'node_modules/rnv-platform-info'
    ].concat(config.modulePaths);

    const rules = {};
    rules.babel = {
        test: /\.js$/,
        include: modulePaths.map(v => path.resolve(projectDir, v)),
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

    const aliases = {
        react: path.resolve(projectDir, 'node_modules/react'),
        'react-native': 'react-native-web',
        'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
        'react-native-vector-icons': path.resolve(projectDir, 'node_modules/react-native-vector-icons'),

    };

    if (config.moduleAliases) {
        for (const key in config.moduleAliases) {
            if (typeof config.moduleAliases[key] === 'string') {
                aliases[key] = config.moduleAliases[key];
            } else {
                aliases[key] = path.resolve(projectDir, config.moduleAliases[key].projectPath);
            }
        }
    }

    const plugins = {};

    plugins.webpack = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(config.environment),
        __DEV__: config.environment === 'production' || true,
    });

    plugins.html = new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: path.resolve(appBuildPublicDir, './index.html'),
        template: path.resolve(platformBuildsSharedDir, './template.js'),
        minify: false,
        templateParameters: {
            ...config,
            debug: process.env.DEBUG,
            debugIp: process.env.DEBUG_IP,
            platform: process.env.PLATFORM,
            environment: config.environment,
        },
    });

    plugins.harddisk = new HtmlWebpackHarddiskPlugin();

    plugins.analyzer = new BundleAnalyzerPlugin();

    plugins.css = new MiniCssExtractPlugin();

    const extensions = config.extensions.map(v => `.${v}`);

    const output = {
        filename: '[name].js',
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
