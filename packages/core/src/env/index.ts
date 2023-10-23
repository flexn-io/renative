import { getAppFolder, getAppId, getConfigProp } from '../common';
import { ANDROID_TV, FIRE_TV, TVOS } from '../constants';
import { RnvContext } from '../context/types';
import { getRelativePath } from '../system/fs';
import { doResolve } from '../system/resolve';
import { RnvModuleConfig, RnvNextJSConfig } from '../types';
import { RnvEnvContext, RnvEnvContextOptions } from './types';
import path from 'path';

export const generateEnvVars = (
    c: RnvContext,
    moduleConfig?: RnvModuleConfig,
    nextConfig?: RnvNextJSConfig,
    opts: RnvEnvContextOptions = {}
) => {
    const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo');
    const monoRoot = getConfigProp(c, c.platform, 'monoRoot') || '../..';

    const envConfig: RnvEnvContext = {
        // RNV_EXTENSIONS: getPlatformExtensions(c),
        RNV_ENGINE_PATH: c.runtime.engine?.rootPath,
        RNV_MODULE_PATHS: moduleConfig?.modulePaths || [],
        RNV_MODULE_ALIASES: moduleConfig?.moduleAliasesArray || [],
        RNV_NEXT_TRANSPILE_MODULES: nextConfig,
        RNV_PROJECT_ROOT: c.paths.project.dir,
        RNV_APP_BUILD_DIR: getRelativePath(c.paths.project.dir, getAppFolder(c)),
        RNV_IS_MONOREPO: isMonorepo,
        RNV_MONO_ROOT: isMonorepo ? path.join(c.paths.project.dir, monoRoot) : c.paths.project.dir,
        RNV_ENGINE: c.runtime.engine?.config.id,
        RNV_IS_NATIVE_TV: c.platform ? [TVOS, ANDROID_TV, FIRE_TV].includes(c.platform) : false,
        RNV_APP_ID: getAppId(c, c.platform),
        RNV_REACT_NATIVE_PATH: getRelativePath(
            c.paths.project.dir,
            doResolve(c.runtime.runtimeExtraProps?.reactNativePackageName || 'react-native')!
        ),
    };
    const excl = opts.exludeEnvKeys || [];
    if (!excl.includes('RNV_EXTENSIONS')) {
        envConfig.RNV_EXTENSIONS = getPlatformExtensions(c);
    }

    return envConfig;
};

export const getPlatformExtensions = (c: RnvContext, excludeServer = false, addDotPrefix = false): Array<string> => {
    const { engine } = c.runtime;
    let output;
    if (!engine || !c.platform) return [];
    const { platforms } = engine;

    if (addDotPrefix) {
        output = platforms[c.platform].extensions
            .map((v) => `.${v}`)
            .filter((ext) => !excludeServer || !ext.includes('server.'));
    } else {
        output = platforms[c.platform].extensions.filter((ext) => !excludeServer || !ext.includes('server.'));
    }
    return output;
};
