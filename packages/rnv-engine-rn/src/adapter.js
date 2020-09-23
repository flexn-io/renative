const blacklist = require('metro-config/src/defaults/blacklist');
const path = require('path');
const { doResolve } = require('rnv');


export const withRNV = (config) => {
    const projectPath = process.env.RNV_PROJECT_ROOT || process.cwd();
    const monoRootPath = process.env.RNV_MONO_ROOT || projectPath;
    const cnf = {
        ...config,
        resolver: {
            blacklistRE: blacklist([
                /platformBuilds\/.*/,
                /buildHooks\/.*/,
                /projectConfig\/.*/,
                /appConfigs\/.*/,
                /renative.local.*/,
                /metro.config.local.*/,
                /platformBuilds\/.*/,
                /buildHooks\/.*/,
                /projectConfig\/.*/,
                /website\/.*/,
                /appConfigs\/.*/,
                /renative.local.*/,
                /metro.config.local.*/,
            ]),
            ...config?.resolver || {},
            extraNodeModules: {
                'react-native': doResolve('react-native'),
                'react-navigation': doResolve('react-navigation'),
                renative: doResolve('renative'),
                ...config?.resolver?.extraNodeModules || []
            }
        },
        watchFolders: [
            path.resolve(projectPath, 'node_modules'),
            path.resolve(monoRootPath, 'node_modules'),
            ...config?.watchFolders || []
        ],
        projectRoot: path.resolve(projectPath)
    };
    cnf.resolver.sourceExts = process.env.RNV_EXTENSIONS.split(',');

    // const mAliases = process.env.RNV_MODULE_ALIASES.split(',');

    return cnf;
};
