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
    const appBuildPublicDir = path.resolve(config.currentDir, 'public');

    const baseUrl = config.baseUrl || '';
    const devServerHost = config.devServerHost || '0.0.0.0'

    const rules = {};
    rules.babel = {
        test: /\.js$/,
        include: [
          path.resolve(projectDir, 'src'),
          path.resolve(projectDir, 'packages'),
          path.resolve(projectDir, 'node_modules/react-navigation-tabs'),
          path.resolve(projectDir, 'node_modules/react-navigation-stack'),
          path.resolve(projectDir, 'node_modules/react-navigation'),
          path.resolve(projectDir, 'node_modules/@react-navigation'),
          path.resolve(projectDir, 'node_modules/react-native-gesture-handler'),
          path.resolve(projectDir, 'node_modules/react-native-reanimated'),
          path.resolve(projectDir, 'node_modules/react-native-camera'),
          path.resolve(projectDir, 'node_modules/react-native-actionsheet'),
          path.resolve(projectDir, 'node_modules/react-native-root-toast'),
          path.resolve(projectDir, 'node_modules/react-native-root-siblings'),
          path.resolve(projectDir, 'node_modules/static-container'),
          path.resolve(projectDir, 'node_modules/react-native-material-dropdown'),
          path.resolve(projectDir, 'node_modules/react-native-material-buttons'),
          path.resolve(projectDir, 'node_modules/react-native-material-textfield'),
          path.resolve(projectDir, 'node_modules/react-native-material-ripple'),
          path.resolve(projectDir, 'node_modules/react-native-easy-grid'),
        ],
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
          'react-native-linear-gradient': 'react-native-web-linear-gradient',
          'react-native-vector-icons': 'react-native-web-vector-icons',
          svgs: path.resolve(projectDir, 'node_modules/svgs'),
          'react-navigation-tabs': path.resolve(projectDir, 'node_modules/react-navigation-tabs'),
          'react-navigation-stack': path.resolve(projectDir, 'node_modules/react-navigation-stack'),
          'react-native-reanimated': path.resolve(projectDir, 'node_modules/react-native-reanimated'),
          'react-native-gesture-handler': path.resolve(projectDir, 'node_modules/react-native-gesture-handler'),
          'react-native-material-dropdown': path.resolve(projectDir, 'node_modules/react-native-material-dropdown'),
          'react-native-material-buttons': path.resolve(projectDir, 'node_modules/react-native-material-buttons'),
          'react-native-material-textfield': path.resolve(projectDir, 'node_modules/react-native-material-textfield'),
          'react-native-material-ripple': path.resolve(projectDir, 'node_modules/react-native-material-ripple'),
          'react-native-easy-grid': path.resolve(projectDir, 'node_modules/react-native-easy-grid'),
          'react-native-svg': 'svgs',
    };

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
