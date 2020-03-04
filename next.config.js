const { withExpo } = require('@expo/next-adapter');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withOffline = require('next-offline');

const modulePaths = [
    'src',
    'packages/renative',
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

const config = {
    projectRoot: __dirname,
    workboxOpts: {
        swDest: 'workbox-service-worker.js',

        /* changing any value means you'll have to copy over all the defaults  */
        /* next-offline */
        globPatterns: ['static/**/*'],
        globDirectory: '.',
        webpack: (config, { dev, isServer, defaultLoaders, webpack }) => {
            config.resolve.alias = {
                ...(config.resolve.alias || {})
              }
              config.module.rules.push({
                  test: /\.+(js|jsx)$/,
                  use: defaultLoaders.babel,
                  include: modulePaths.map(v => path.resolve(v)),
              });
              //return config
            },
        runtimeCaching: [
            {
                urlPattern: /^https?.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'offlineCache',
                    expiration: {
                        maxEntries: 200,
                    },
                },
            },
        ],
    },
}



module.exports = withExpo(withOffline(withFonts(withImages(config))));
