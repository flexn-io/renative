
const path = require('path');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');

const modulePaths = [
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
];

const nextConfig = {

    webpack: (config, { dev, isServer, defaultLoaders, webpack }) => {
        // Alias all `react-native` imports to `react-native-web`
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react-native$': 'react-native-web',
            'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            'react-native/Libraries/Image/resolveAssetSource': 'react-native-web/dist/exports/Image/resolveAssetUri',
            'react-native-vector-icons': 'react-native-web-vector-icons',
            'react-native-screens': 'react-native-screens',
            'react-navigation-tabs': 'react-navigation-tabs',
            'react-navigation-stack': 'react-navigation-stack',
            'react-navigation': 'react-navigation',
            '@react-navigation': '@react-navigation',
            'react-native-gesture-handler': 'react-native-gesture-handler',
            'react-native-reanimated': 'react-native-reanimated',
            'react-native-camera': 'react-native-camera',
            'react-native-actionsheet': 'react-native-actionsheet',
            'react-native-root-toast': 'react-native-root-toast',
            'react-native-root-siblings': 'react-native-root-siblings',
            'static-container': 'static-container',
            'react-native-material-dropdown': 'react-native-material-dropdown',
            'react-native-material-buttons': 'react-native-material-buttons',
            'react-native-material-textfield': 'react-native-material-textfield',
            'react-native-material-ripple': 'react-native-material-ripple',
            'react-native-easy-grid': 'react-native-easy-grid',
            'native-base-shoutem-theme': 'native-base-shoutem-theme',
            'react-native-drawer': 'react-native-drawer',
            'react-native-safe-area-view': 'react-native-safe-area-view',
            'react-native-keyboard-aware-scroll-view': 'react-native-keyboard-aware-scroll-view',
            'query-string': 'query-string',
            'split-on-first': 'split-on-first',
            'strict-uri-encode': 'strict-uri-encode',
            '@react-navigation/core': '@react-navigation/core',
            '@react-navigation/web': '@react-navigation/web',
            'react-native-animatable': 'react-native-animatable',
            'react-native-collapse-view': 'react-native-collapse-view',
            'react-native-color-picker': 'react-native-color-picker',
            'react-native-ios-picker': 'react-native-ios-picker',
            'react-native-modal-datetime-picker': 'react-native-modal-datetime-picker/',
            'react-native-modal': 'react-native-modal',
            'react-native-paper': 'react-native-paper',
            'react-native-platform-touchable': 'react-native-platform-touchable',
            'react-native-super-grid': 'react-native-super-grid',
            'react-native-tab-view': 'react-native-tab-view',
            'react-native-simple-markdown': 'react-native-simple-markdown',
            'react-native-swipe-gestures': 'react-native-swipe-gestures',
            'react-native-switch': 'react-native-switch',
            'react-native-orientation-locker': 'react-native-orientation-locker',
            '@react-navigation/native': '@react-navigation/native',
        };


        // defaultLoaders.babel.options.plugins.push(...modulePaths);
        config.module.rules.push({
            test: /\.+(js|jsx)$/,
            use: defaultLoaders.babel,
            include: modulePaths.map(v => path.resolve(v)),
        });
        config.resolve.modules.push(path.resolve('./'));
        config.resolve.extensions = ['.web.js', '.next.js', ...config.resolve.extensions];

        return config;
    }
};


module.exports = withPlugins([withCSS, withFonts, withImages], nextConfig);
