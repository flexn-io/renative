const config = {
    root: './',
    reactNativePath: '../../node_modules/react-native',
    platforms: {
        ios: {},
        android: {},
    },
    project: {
        ios: {
            sourceDir: './platformBuilds/template_ios',
        },
        android: {
            appName: 'app',
            sourceDir: './platformBuilds/template_android',
            packageName: 'com.testrnproject',
        },
    },
};

module.exports = config;
