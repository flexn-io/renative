const withCSS = require('@zeit/next-css');
const path = require('path');

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
];

const projectDir = path.join(__dirname, '../');

module.exports = withCSS({
    // With CSS modules:
    assetPrefix: '',
    webpack: (config, options) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            react: path.resolve(projectDir, 'node_modules/react'),
            'react-native': 'react-native-web',
            'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            'react-native-vector-icons': path.resolve(projectDir, 'node_modules/react-native-vector-icons'),
            'react-native-screens': path.resolve(projectDir, 'node_modules/react-native-screens'),
        };
        config.module.rules.push({
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
        console.log('&&&&&', projectDir);
        // console.log(config);
        // console.log('opts', options);
        return config;
    }
});
