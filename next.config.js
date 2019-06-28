
const withImages = require('next-images');
const withFonts = require('next-fonts');

module.exports = withFonts(withImages({

    webpack: (config) => {
        // Alias all `react-native` imports to `react-native-web`
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react-native': 'react-native-web',
            'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
        };
        return config;
    }
}));
