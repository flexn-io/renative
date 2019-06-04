const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function generateConfig(config) {
    const projectDir = path.resolve(config.currentDir, '../../');
    const platformBuildsDir = path.resolve(config.currentDir, '../');
    const platformBuildsSharedDir = path.join(platformBuildsDir, '_shared');
    const appBuildDir = path.resolve(config.currentDir);
    const appBuildPublicDir = path.resolve(config.currentDir, config.buildFolder || 'public');

    const baseUrl = config.baseUrl || '';
    const devServerHost = config.devServerHost || '0.0.0.0';

    const modulePaths = [
        'src',
        'packages',
        // 'node_modules/react-navigation-tabs',
        // 'node_modules/react-navigation-stack',
        // 'node_modules/react-navigation',
        // 'node_modules/@react-navigation',
        // 'node_modules/react-native-gesture-handler',
        // 'node_modules/react-native-reanimated',
        // 'node_modules/react-native-camera',
        // 'node_modules/react-native-actionsheet',
        // 'node_modules/react-native-root-toast',
        // 'node_modules/react-native-root-siblings',
        // 'node_modules/static-container',
        // 'node_modules/react-native-material-dropdown',
        // 'node_modules/react-native-material-buttons',
        // 'node_modules/react-native-material-textfield',
        // 'node_modules/react-native-material-ripple',
        // 'node_modules/react-native-easy-grid',
        // 'node_modules/native-base-shoutem-theme',
        // 'node_modules/react-native-drawer',
        // 'node_modules/react-native-safe-area-view',
        // 'node_modules/react-native-vector-icons',
        // 'node_modules/react-native-keyboard-aware-scroll-view',
        // 'node_modules/react-native-tab-view',
    ].concat(config.modulePaths);

    const rules = {};
    rules.babel = {
        test: /\.js$/,
        include: modulePaths.map(v => path.resolve(projectDir, v)),
        use: {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                presets: [['module:metro-react-native-babel-preset']],
            },
        },
    };

    rules.css = {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(
            ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
            })
        ),
    };

    rules.image = {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
            loader: 'react-native-web-image-loader',
        },
    };

    rules.fonts = {
        test: /\.(ttf|otf)(\?[\s\S]+)?$/,
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
        'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
        // 'react-native-linear-gradient': 'react-native-web-linear-gradient',
        // 'react-native-vector-icons': 'react-native-web-vector-icons',
        'react-native-vector-icons': path.resolve(projectDir, 'node_modules/react-native-vector-icons'),
        // 'react-native-vector-icons/Entypo': path.resolve(projectDir, 'node_modules/react-native-vector-icons/dist/Entypo'),
        // svgs: path.resolve(projectDir, 'node_modules/svgs'),
        // 'react-navigation-tabs': path.resolve(projectDir, 'node_modules/react-navigation-tabs'),
        // 'react-navigation-stack': path.resolve(projectDir, 'node_modules/react-navigation-stack'),
        // 'react-native-reanimated': path.resolve(projectDir, 'node_modules/react-native-reanimated'),
        // 'react-native-gesture-handler': path.resolve(projectDir, 'node_modules/react-native-gesture-handler'),
        // 'react-native-material-dropdown': path.resolve(projectDir, 'node_modules/react-native-material-dropdown'),
        // 'react-native-material-buttons': path.resolve(projectDir, 'node_modules/react-native-material-buttons'),
        // 'react-native-material-textfield': path.resolve(projectDir, 'node_modules/react-native-material-textfield'),
        // 'react-native-material-ripple': path.resolve(projectDir, 'node_modules/react-native-material-ripple'),
        // 'react-native-easy-grid': path.resolve(projectDir, 'node_modules/react-native-easy-grid'),
        // 'react-native-svg': 'svgs',
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
        },
    });
    plugins.harddisk = new HtmlWebpackHarddiskPlugin();

    const extensions = config.extensions.map(v => `.${v}.js`).concat(['.js']);

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
