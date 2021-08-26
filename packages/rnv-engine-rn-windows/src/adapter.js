const fs = require('fs');
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

export const withRNV = (config) => {
    const rnwPath = fs.realpathSync(
        path.resolve(require.resolve('react-native-windows/package.json'), '..'),
    );

    const projectPath = process.env.RNV_PROJECT_ROOT || process.cwd();

    const watchFolders = [rnwPath, path.resolve(projectPath, 'node_modules')];

    if (process.env.RNV_IS_MONOREPO === 'true' || process.env.RNV_IS_MONOREPO === true) {
        const monoRootPath = process.env.RNV_MONO_ROOT || projectPath;
        watchFolders.push(path.resolve(monoRootPath, 'node_modules'));
        watchFolders.push(path.resolve(monoRootPath, 'packages'));
    }
    if (config?.watchFolders?.length) {
        watchFolders.push(...config.watchFolders);
    }


    const cnf = {
        ...config,
        resolver: {
            blacklistRE: blacklist([
                // This stops "react-native run-windows" from causing the metro server to crash if its already running
                // TODO. Project name should be dynamically injected here somehow
                new RegExp(
                    `${process.env.RNV_APP_BUILD_DIR.replace(/[/\\]/g, '/')}.*`,
                ),
                // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip
                /.*\.ProjectImports\.zip/,
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
            extraNodeModules: {
                // Redirect react-native-windows to avoid symlink (metro doesn't like symlinks)
                'react-native-windows': rnwPath,
            },
        },
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true,
                },
            }),
        },
        watchFolders,
        projectRoot: path.resolve(projectPath)
    };

    cnf.resolver.sourceExts = process.env.RNV_EXTENSIONS.split(',');

    return cnf;
};
