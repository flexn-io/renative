import { getAppFolder, getConfigRootProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { RnvContext } from '../context/types';
import { getRelativePath } from '../system/fs';
import { RnvEnvContext } from './types';
import path from 'path';

export const CoreEnvVars = {
    RNV_EXTENSIONS: () => {
        const ctx = getContext();
        return { RNV_EXTENSIONS: _getPlatformExtensions(ctx) };
    },
    BASE: () => {
        const ctx = getContext();
        return _generateEnvVars(ctx);
    },
};

const _generateEnvVars = (c: RnvContext) => {
    const isMonorepo = getConfigRootProp('isMonorepo');
    const monoRoot = getConfigRootProp('monoRoot') || '../..';

    const envConfig: RnvEnvContext = {
        RNV_ENGINE_PATH: c.runtime.engine?.rootPath,
        RNV_PROJECT_ROOT: c.paths.project.dir,
        RNV_APP_BUILD_DIR: getRelativePath(c.paths.project.dir, getAppFolder()),
        RNV_IS_MONOREPO: isMonorepo,
        RNV_MONO_ROOT: isMonorepo ? path.join(c.paths.project.dir, monoRoot) : c.paths.project.dir,
        RNV_ENGINE: c.runtime.engine?.id,
        RNV_IS_NATIVE_TV: c.platform ? ['tvos', 'androidtv', 'firetv'].includes(c.platform) : false,
    };

    return envConfig;
};

const _getPlatformExtensions = (c: RnvContext, excludeServer = false, addDotPrefix = false): Array<string> => {
    const { engine } = c.runtime;
    let output;
    if (!engine || !c.platform) return [];
    const { platforms } = engine;

    if (addDotPrefix) {
        output = platforms[c.platform]?.extensions
            .map((v) => `.${v}`)
            .filter((ext) => !excludeServer || !ext.includes('server.'));
    } else {
        output = platforms[c.platform]?.extensions.filter((ext) => !excludeServer || !ext.includes('server.'));
    }
    return output || [];
};
