

const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');

const nextConfig = {

    webpack: (config) => {
        // Alias all `react-native` imports to `react-native-web`
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react-native$': 'react-native-web',
            'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            'react-native/Libraries/Image/resolveAssetSource': 'react-native-web/dist/exports/Image/resolveAssetUri',
        };
        config.resolve.extensions = ['.web.js', '.next.js', ...config.resolve.extensions];
        return config;
    }
};


module.exports = withPlugins([withFonts, withImages], nextConfig);
