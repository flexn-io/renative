import { Env } from '@rnv/core';
import { withMetroConfig, mergeConfig, InputConfig } from '@rnv/sdk-react-native';

const path = require('path');

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

export const withRNVMetro = (config: InputConfig): InputConfig => {
    const projectPath = env.RNV_PROJECT_ROOT || process.cwd();

    const defaultConfig = withMetroConfig(projectPath);

    const watchFolders = [path.resolve(projectPath, 'node_modules')];

    if (env.RNV_IS_MONOREPO === 'true' || env.RNV_IS_MONOREPO === true) {
        const monoRootPath = env.RNV_MONO_ROOT || projectPath;
        watchFolders.push(path.resolve(monoRootPath, 'node_modules'));
        watchFolders.push(path.resolve(monoRootPath, 'packages'));
    }
    if (config?.watchFolders?.length) {
        watchFolders.push(...config.watchFolders);
    }

    const exts: string = env.RNV_EXTENSIONS || '';

    let blacklistRE = [
        blacklist([
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
    ];

    if (config?.resolver?.blacklistRE) {
        blacklistRE = blacklistRE.concat(config.resolver.blacklistRE);
    }

    const cnfRnv: InputConfig = {
        transformer: {
            getTransformOptions: async (entryPoints, options, getDependenciesOf) => {
                const transformOptions =
                    (await config?.transformer?.getTransformOptions?.(entryPoints, options, getDependenciesOf)) || {};

                return {
                    ...transformOptions,
                    transform: {
                        experimentalImportSupport: false,
                        // this defeats the RCTDeviceEventEmitter is not a registered callable module
                        inlineRequires: true,
                        ...(transformOptions?.transform || {}),
                    },
                };
            },
        },
        resolver: {
            blacklistRE,
            sourceExts: [...(config?.resolver?.sourceExts || []), ...exts.split(',')],
        },
        watchFolders,
        projectRoot: config?.projectRoot || path.resolve(projectPath),
    };

    const cnf = mergeConfig(defaultConfig, config, cnfRnv);

    return cnf;
};
