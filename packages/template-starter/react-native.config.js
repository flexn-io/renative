// console.log('process EEEENV', process.env);
//! NO CONSOLE LOGS HERE. IT WILL BREAK THE BUILD

const getApplicationId = () => {
    const appId = process.env.RNV_APP_ID;
    return appId;
};

const getPlatformAppFolder = () => {
    const pth = process.env.RNV_APP_BUILD_DIR;
    const dir = pth.split('platformBuilds/')[1];
    return `./platformBuilds/${dir}`;
};

const config = {
    root: './',
    reactNativePath: '../../node_modules/react-native',
    platforms: {
        ios: {},
        android: {},
    },
    project: {
        ios: {
            sourceDir: getPlatformAppFolder(),
        },
        android: {
            appName: 'app',
            sourceDir: getPlatformAppFolder(),
            packageName: getApplicationId(),
        },
    },
};

module.exports = config;
