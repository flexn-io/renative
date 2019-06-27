const path = require('path');
const withImages = require('next-images');


const projectDir = path.resolve('./');
module.exports = withImages({
    webpack: (config) => {
        // Alias all `react-native` imports to `react-native-web`
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react-native': 'react-native-web',
            // 'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            // 'react-native/Libraries/Image/resolveAssetSource': 'react-native-web/dist/exports/Image/resolveAssetUri',
            // 'react-native-linear-gradient': 'react-native-web-linear-gradient',
            // 'react-native-vector-icons': 'react-native-web-vector-icons',
            // // 'react-native-vector-icons': 'react-native-vector-icons',
            // 'react-native-vector-icons/Entypo': path.resolve(projectDir, 'node_modules/react-native-vector-icons/dist/Entypo'),
            // svgs: path.resolve(projectDir, 'node_modules/svgs'),
            // 'react-navigation-tabs': 'react-navigation-tabs',
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

        return config;
    }
});
