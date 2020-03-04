const withCSS = require('@zeit/next-css');
const path = require('path');
const getSourceExt = require('rnv/dist/common').getSourceExts;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const modulePaths = [
    'index.webos.js',
    'index.tizen.js',
    'src',
    'packages',
    'node_modules/renative',
    'node_modules/react-native-screens',
    'node_modules/react-navigation-tabs',
    'node_modules/react-navigation-stack',
    'node_modules/react-navigation',
    'node_modules/react-navigation/node_modules/react-navigation-tabs',
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
    'node_modules/rnv-platform-info',
    'node_modules/react-native',
    'node_modules/react-native-web'
];

const projectDir = path.join(__dirname);
const extensions = getSourceExt({ platform: 'web-next' });

module.exports = withCSS({
    // With CSS modules:
    assetPrefix: '',
    webpack: (config, options) => {
        config.resolve.alias = {
            // react: path.resolve('react'),
            'react-native': 'react-native-web',
            'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            ...config.resolve.alias,
            // 'react-native-screens': resolve.sync('react-native-screens'),
        };
        config.module.rules.unshift({
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
        });
        config.module.rules.push({
            test: /\.css$/,
            use: ['css-hot-loader'].concat(
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                'css-loader',
            ),
        });

        config.module.rules.push({
            test: /\.(gif|jpe?g|png|svg)$/,
            use: {
                loader: 'react-native-web-image-loader',
            },
        });

        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)(\?[\s\S]+)?$/,
            use: 'file-loader',
        });

        config.module.rules.push({
            test: /\.js$/,
            use: ['source-map-loader'],
            enforce: 'pre',
            exclude: [/node_modules/, /build/, /__test__/]
        });
        config.resolve.extensions = [...config.resolve.extensions, ...extensions.map(ext => `.${ext}`)]; // add our extensions. Will be duplicates!
        console.log(JSON.stringify(config, null, 3));
        console.log('ext', extensions);
        console.log('opts', JSON.stringify(options, null, 3));
        return config;
    }
});
