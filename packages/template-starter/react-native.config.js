// console.log('process EEEENV', process.env);
//! NO CONSOLE LOGS HERE. IT WILL BREAK THE BUILD

// const getApplicationId = () => {
//     const appId = process.env.RNV_APP_ID;
//     return appId;
// };

const getAppFolderRelative = () => {
    const pth = process.env.RNV_APP_BUILD_DIR;
    if (pth) {
        // const dir = pth.split(getProjectRoot())[1];
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
    //env: REACT_NATIVE_PATH
    const rnPath = process.env.RNV_REACT_NATIVE_PATH;
    // return '/Users/paveljacko/SAPDevelop/Code/TEMP/RN_TVOS/TestApp2/node_modules/react-native-tvos';
    // return '../../node_modules/react-native-tvos';
    return rnPath;
};

const getProjectRoot = () => {
    //env: PROJECT_ROOT
    const rnPath = process.env.RNV_PROJECT_ROOT;
    return rnPath;
};

const config = {
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
        // android: {
        //     appName: 'app',
        //     sourceDir: getPlatformAppFolder(),
        //     packageName: getApplicationId(),
        // },
    },
};

module.exports = config;

// module.exports = {
//     dependencies: {
//       // Required for Expo CLI to be used with platforms (such as Apple TV) that are not supported in Expo SDK
//       expo: {
//         platforms: {
//           android: null,
//           ios: null,
//           macos: null,
//         },
//       },
//     },
//     // root: '/Users/paveljacko/SAPDevelop/Code/TEMP/RN_TVOS/TestApp2/packages/template-starter',
//     project: {
//         ios: {
//             sourceDir: "platformBuilds/template_tvos",// MUST BE RELATIVE
//         }
//     }
//   };
