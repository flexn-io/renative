require('./load-module-cache');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { doResolve, doResolvePath } = require('rnv');

function generateConfig(config) {
    const projectDir = path.resolve(config.currentDir, '../../');
    const platformBuildsDir = path.resolve(config.currentDir, '../');
    const platformBuildsSharedDir = path.join(platformBuildsDir, '_shared');
    const appBuildDir = path.resolve(config.currentDir);
    const appBuildPublicDir = path.resolve(
        config.currentDir,
        config.buildFolder || 'public'
    );

    const baseUrl = config.baseUrl || '';
    const devServerHost = config.devServerHost || '0.0.0.0';

    const relativeModules = [
        'index.webos.js',
        'index.tizen.js',
        'src'
        // 'packages'
    ]
        .concat(config.modulePaths)
        .map(p => path.resolve(projectDir, p));
    const externalModules = [
        'react-native-screens',
        'react-navigation-tabs',
        'react-navigation-stack',
        'react-navigation',
        // '@react-navigation',
        'react-native-gesture-handler',
        'react-native-reanimated',
        'react-native-camera',
        'react-native-actionsheet',
        'react-native-root-toast',
        'react-native-root-siblings',
        'static-container',
        'react-native-material-dropdown',
        'react-native-material-buttons',
        'react-native-material-textfield',
        'react-native-material-ripple',
        'react-native-easy-grid',
        'native-base-shoutem-theme',
        'react-native-drawer',
        'react-native-safe-area-view',
        'react-native-vector-icons',
        'react-native-keyboard-aware-scroll-view',
        'react-native-tab-view',
        'query-string',
        'split-on-first',
        'strict-uri-encode',
        '@react-navigation/core',
        '@react-navigation/web',
        'react-native-animatable',
        'react-native-collapse-view',
        'react-native-color-picker',
        'react-native-ios-picker',
        'react-native-modal-datetime-picker',
        'react-native-modal',
        'react-native-paper',
        'react-native-animatable',
        'react-native-collapse-view',
        'react-native-color-picker',
        'react-native-ios-picker',
        'react-native-modal-datetime-picker/',
        'react-native-modal',
        'react-native-paper',
        'react-native-platform-touchable',
        'react-native-safe-area-view',
        'react-native-super-grid',
        'react-native-tab-view',
        'react-native-vector-icons',
        'react-native-simple-markdown',
        'react-native-swipe-gestures',
        'react-native-switch',
        'react-native-orientation-locker',
        'react-navigation',
        '@react-navigation/native',
        'rnv-platform-info',
        'renative'
    ].map(pkg => doResolve(pkg, false));
    const modulePaths = [...relativeModules, ...externalModules].filter(
        Boolean
    );

    const rules = {};
    rules.babel = {
        test: /\.js$/,
        // include: modulePaths.map(v => path.resolve(projectDir, v)),
        include: modulePaths,
        use: {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                plugins: ['@babel/plugin-proposal-class-properties'],
                presets: [
                    'module:metro-react-native-babel-preset',
                    [
                        '@babel/preset-env',
                        {
                            forceAllTransforms: true,
                            targets: 'Samsung 4',
                            spec: true
                        }
                    ]
                ]
            }
        }
    };

    rules.css = {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(
            {
                loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
        )
    };

    rules.image = {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
            loader: 'react-native-web-image-loader'
        }
    };

    rules.fonts = {
        test: /\.(woff|woff2|eot|ttf|otf)(\?[\s\S]+)?$/,
        use: 'file-loader'
    };

    rules.sourcemap = {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [/node_modules/, /build/, /__test__/]
    };

    const aliases = {
        react: doResolve('react'),
        'react-native': doResolve('react-native-web'),
        renative: doResolve('renative'),
        'react-native/Libraries/Renderer/shims/ReactNativePropRegistry':
            'react-native-web/dist/modules/ReactNativePropRegistry',
        'react-native-vector-icons': doResolve('react-native-vector-icons')
    };

    if (config.moduleAliases) {
        // eslint-disable-next-line no-restricted-syntax, no-unused-vars
        for (const key in config.moduleAliases) {
            if (typeof config.moduleAliases[key] === 'string') {
                // aliases[key] = config.moduleAliases[key];
                aliases[key] = doResolve(config.moduleAliases[key]);
            } else {
                // aliases[key] = path.resolve(
                //     projectDir,
                //     config.moduleAliases[key].projectPath
                // );
                aliases[key] = doResolvePath(config.moduleAliases[key].path);
            }
        }
    }

    const plugins = {};

    plugins.webpack = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(config.environment),
        __DEV__: config.environment === 'production' || true
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
            environment: config.environment
        }
    });

    plugins.harddisk = new HtmlWebpackHarddiskPlugin();

    plugins.analyzer = new BundleAnalyzerPlugin();

    plugins.css = new MiniCssExtractPlugin();

    const extensions = config.extensions.map(v => `.${v}`);

    const output = {
        filename: '[name].js',
        publicPath: `${baseUrl}assets/`,
        path: path.join(appBuildPublicDir, 'assets')
    };

    const devServer = {
        host: devServerHost
    };

    const entry = {
        fetch: 'whatwg-fetch',
        polyfill: 'babel-polyfill',
        bundle: path.resolve(projectDir, `${config.entryFile}.js`)
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
        platformBuildsSharedDir
    };
}

module.exports = {
    generateConfig
};
