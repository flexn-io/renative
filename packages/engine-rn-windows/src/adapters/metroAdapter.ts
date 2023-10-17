const path = require('path');
import { Env } from '@rnv/core';
import fs from 'fs';

const sharedBlacklist = [
    /node_modules\/react\/dist\/.*/,
    /website\/node_modules\/.*/,
    /heapCapture\/bundle\.js/,
    /.*\/__tests__\/.*/,
];

const env: Env = process?.env;

function escapeRegExp(pattern: RegExp | string) {
    if (typeof pattern === 'string') {
        // eslint-disable-next-line
        const escaped = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // convert the '/' into an escaped local file separator

        return escaped.replace(/\//g, `\\${path.sep}`);
    } else if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
        return pattern.source.replace(/\//g, path.sep);
    }
    throw new Error(`Unexpected blacklist pattern: ${pattern}`);
}

function blacklist(additionalBlacklist: RegExp[]) {
    return new RegExp(`(${(additionalBlacklist || []).concat(sharedBlacklist).map(escapeRegExp).join('|')})$`);
}

export const withRNVMetro = (config: any) => {
    const projectPath = process.env.RNV_PROJECT_ROOT || process.cwd();
    const rnwPath = fs.realpathSync(path.resolve(require.resolve('react-native-windows/package.json'), '..'));

    const watchFolders = [path.resolve(projectPath, 'node_modules')];

    if (env.RNV_IS_MONOREPO === 'true' || env.RNV_IS_MONOREPO === true) {
        const monoRootPath = process.env.RNV_MONO_ROOT || projectPath;
        watchFolders.push(path.resolve(monoRootPath, 'node_modules'));
        watchFolders.push(path.resolve(monoRootPath, 'packages'));
    }
    if (config?.watchFolders?.length) {
        watchFolders.push(...config.watchFolders);
    }

    const exts: string = env.RNV_EXTENSIONS || '';

    const cnf = {
        ...config,
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    // this defeats the RCTDeviceEventEmitter is not a registered callable module
                    inlineRequires: true,
                },
            }),
            ...(config?.resolver || {}),
            sourceExts: [...(config?.resolver?.sourceExts || []), ...exts.split(',')],
            extraNodeModules: config?.resolver?.extraNodeModules,
            ...(config?.transformer || {}),
        },
        resolver: {
            blacklistRE: blacklist([
                /platformBuilds\/.*/,
                /buildHooks\/.*/,
                /projectConfig\/.*/,
                /website\/.*/,
                /appConfigs\/.*/,
                /renative.local.*/,
                /metro.config.local.*/,
                /.expo\/.*/,
                /.rollup.cache\/.*/,
            ]),
            extraNodeModules: {
                // Redirect react-native-windows to avoid symlink (metro doesn't like symlinks)
                'react-native-windows': rnwPath,
            },
        },
        watchFolders,
        sourceExts: [...(config?.resolver?.sourceExts || []), ...exts.split(',')],
        projectRoot: path.resolve(projectPath),
    };

    return cnf;
};
