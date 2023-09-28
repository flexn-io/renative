// console.log('process EEEENV', process.env);
//! NO CONSOLE LOGS HERE. IT WILL BREAK THE BUILD

const getApplicationId = () => {
    const appId = process.env.RNV_APP_ID;
    return appId;
};

const getPlatformAppFolder = () => {
    const pth = process.env.RNV_APP_BUILD_DIR;
    if (pth) {
        const dir = pth.split('platformBuilds/')[1];
        return `./platformBuilds/${dir}`;
    } else {
        return process.cwd();
    }
};

const getReactNativePath = () => {
    //env: REACT_NATIVE_PATH
    const rnPath = process.env.RNV_REACT_NATIVE_PATH;
    return rnPath;
};

const getProjectRoot = () => {
    //env: PROJECT_ROOT
    const rnPath = process.env.RNV_PROJECT_ROOT;
    return rnPath || './';
};

const config = {
    root: getProjectRoot(),
    reactNativePath: getReactNativePath(),
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
