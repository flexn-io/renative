import merge from 'deepmerge';

const getApplicationId = () => {
    const appId = process.env.RNV_APP_ID;
    return appId;
};

const getAppFolderRelative = () => {
    const pth = process.env.RNV_APP_BUILD_DIR;
    if (pth) {
        return pth;
    } else {
        const cwd = process.cwd();
        if (cwd.includes('platformBuilds/')) {
            const dir = process.cwd().split('platformBuilds/')[1];

            return `platformBuilds/${dir}`;
        } else {
            return undefined;
        }
    }
};

const getReactNativePathRelative = () => {
    const rnPath = process.env.RNV_REACT_NATIVE_PATH;
    return rnPath;
};

const getProjectRoot = () => {
    //env: PROJECT_ROOT
    const rnPath = process.env.RNV_PROJECT_ROOT;
    return rnPath;
};

export const withRNVRNConfig = (config: any) => {
    const cnfRnv = {
        root: getProjectRoot(),
        //Required to support 2 react native instances
        reactNativePath: getReactNativePathRelative(),
        dependencies: {
            // Required for Expo CLI to be used with platforms (such as Apple TV) that are not supported in Expo SDK
            expo: {
                platforms: {
                    android: null,
                    ios: null,
                    macos: null,
                },
            },
        },
        project: {
            ios: {
                sourceDir: getAppFolderRelative(),
            },
            android: {
                appName: 'app',
                sourceDir: getAppFolderRelative(),
                packageName: getApplicationId(),
            },
        },
    };

    const cnf = merge(cnfRnv, config);
    return cnf;
};
