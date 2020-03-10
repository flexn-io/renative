const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const resolve = require('resolve');
const metroConfigHelper = require('react-native-monorepo-helper')
    .metroConfigHelper;
const sourceExts = require('./metro.config.local');

function doResolve(aPath, options) {
    return resolve
        .sync(aPath, {
            packageFilter: pkg => {
                pkg.main = 'package.json';
                return pkg;
            },
            ...options
        })
        .replace(/\/package.json$/, '');
}

const defaultConfig = {
    resolver: {
        sourceExts,
        blacklistRE: blacklist([
            /platformBuilds\/.*/,
            /buildHooks\/.*/,
            /projectConfig\/.*/,
            // /website\/.*/,
            /appConfigs\/.*/,
            /renative.local.*/,
            /metro.config.local.*/
            // /packages\/rnv\/.*/,
            // /packages\/rnv-deploy-docker\/.*/,
            // /packages\/renative-template-hello-world\/.*/,
            // /packages\/renative-template-kitchen-sink\/.*/,
            // /packages\/renative-template-blank\/.*/
        ])
        // extraNodeModules: {
        //     'react-native': doResolve('react-native')
        // //     // 'react-native/Libraries/Image/AssetRegistry': doResolve('react-native/Libraries/Image/AssetRegistry'),
        // }

        // resolveRequest: (metro, moduleName, _platform) => {
        //     // const context: IResolverContext = {
        //     //     metro,
        //     //     moduleName,
        //     //     platform,
        //     // };

        //     // const sourceExts = metro.sourceExts;
        //     // const assetExts = metro.assetExts || [];

        //     return doResolve(moduleName, { extensions: metro.sourceExts });
        //     // const resolution =
        //     //     this.resolveInProject(context, Metro.ResolutionType.SOURCE_FILE, sourceExts)
        //     //     || this.resolveInProject(context, Metro.ResolutionType.ASSET, assetExts)
        //     //     || null;

        //     // return resolution;
        // },
    }
    // assetRegistryPath: doResolve('react-native/Libraries/Image/AssetRegistry')
    // watchFolders: [
    //     path.resolve(__dirname, '../../node_modules'),
    //     path.resolve(__dirname, './node_modules'),
    //     path.resolve(__dirname, './'),
    // ],
    // transformer: {
    //     enableBabelRuntime: true,
    // },
    // projectRoot: path.resolve(__dirname),
};

// module.exports = defaultConfig;
module.exports = metroConfigHelper(path.resolve(__dirname))
    .defaultConfig(defaultConfig)
    .generate();
