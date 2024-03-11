import { GetConfigPropFn } from '../api/types';
import { RnvContext } from './types';
import { chalk, logError, logWarning } from '../logger';
import { ConfigFileBuildConfig } from '../schema';
import { ConfigProp, ConfigPropKey } from '../schema/types';
import { BuildConfigPropKey, BuildSchemePropKey, CommonPropKey, PlatPropKey } from '../types';
import { TimestampPathsConfig } from '../system/types';
import path from 'path';
import { fsExistsSync } from '../system/fs';
import { getContext } from './provider';

const _getValueOrMergedObject = (resultScheme: object, resultPlatforms: object, resultCommon: object) => {
    if (resultScheme !== undefined) {
        if (Array.isArray(resultScheme) || typeof resultScheme !== 'object') {
            return resultScheme;
        }
        const val = Object.assign(resultCommon || {}, resultPlatforms || {}, resultScheme);
        return val;
    }
    if (resultPlatforms !== undefined) {
        if (Array.isArray(resultPlatforms) || typeof resultPlatforms !== 'object') {
            return resultPlatforms;
        }
        return Object.assign(resultCommon || {}, resultPlatforms);
    }
    if (resultPlatforms === null) return undefined;
    return resultCommon;
};

export const getConfigProp: GetConfigPropFn = <T extends ConfigPropKey>(
    key: T,
    defaultVal?: ConfigProp[T]
): ConfigProp[T] => {
    const c = getContext();
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return undefined;
    }
    return _getConfigProp<T>(c, key, defaultVal, c.buildConfig);
};

export const _getConfigProp = <T extends ConfigPropKey>(
    c: RnvContext,
    key: T,
    defaultVal?: ConfigProp[T],
    sourceObj?: Partial<ConfigFileBuildConfig>
): ConfigProp[T] => {
    const { platform } = c;
    if (!sourceObj || !platform) return undefined;

    const platformObj = sourceObj.platforms?.[platform];
    const ps = c.runtime.scheme;
    // const baseKey = key as PlatPropKey;

    let resultPlatforms;
    let scheme;
    if (platformObj && ps) {
        scheme = platformObj.buildSchemes?.[ps] || {};
        resultPlatforms = getFlavouredProp(c, platformObj, key as PlatPropKey);
    } else {
        scheme = {};
    }

    const resultScheme = key && scheme[key as BuildSchemePropKey];
    const resultCommonRoot = getFlavouredProp(c, sourceObj.common || {}, key as CommonPropKey);
    const resultCommonScheme =
        c.runtime.scheme &&
        getFlavouredProp(c, sourceObj.common?.buildSchemes?.[c.runtime.scheme] || {}, key as BuildSchemePropKey);

    const resultCommon = resultCommonScheme || resultCommonRoot;

    let result = _getValueOrMergedObject(resultScheme, resultPlatforms, resultCommon);
    if (result === undefined) {
        result = getFlavouredProp(c, sourceObj, key as BuildConfigPropKey);
    }

    if (result === undefined) result = defaultVal; // default the value only if it's not specified in any of the files. i.e. undefined

    return result as ConfigProp[T];
};

export const getFlavouredProp = <T, K extends keyof T>(c: RnvContext, obj: T, key: K): T[K] | undefined => {
    if (!key || !obj || typeof key !== 'string') return undefined;
    const keyScoped = `${key}@${c.runtime.scheme}` as K;
    const val1 = obj[keyScoped];
    if (val1) return val1;
    return obj[key];
};

export const getTimestampPathsConfig = (): TimestampPathsConfig | undefined => {
    const c = getContext();
    const { platform } = c;
    let timestampBuildFiles: Array<string> = [];
    const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
    if (platform === 'web') {
        timestampBuildFiles = (getConfigProp('timestampBuildFiles') || []).map((v) => path.join(pPath, v));
    }
    if (timestampBuildFiles?.length && c.runtime.timestamp) {
        return { paths: timestampBuildFiles, timestamp: c.runtime.timestamp };
    }
    return undefined;
};

//TODO: rename to getPlatformBuildAppDir ???
export const getAppFolder = (isRelativePath?: boolean) => {
    const c = getContext();
    if (isRelativePath) {
        return `platformBuilds/${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`;
    }
    return path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`
    );
};

export const getPlatformProjectDir = () => {
    const c = getContext();
    if (!c.runtime.engine) {
        logError('getPlatformProjectDir not available without specific engine');
        return null;
    }
    return path.join(getAppFolder(), c.runtime.engine.projectDirName || '');
};

export const getAppConfigBuildsFolder = (customPath?: string) => {
    const c = getContext();
    const { platform } = c;
    const pp = customPath || c.paths.appConfig.dir;
    if (!pp) {
        logWarning(
            `getAppConfigBuildsFolder: Path ${chalk().bold(
                'c.paths.appConfig.dir'
            )} not defined! can't return path. You might not be in renative project`
        );
        return null;
    }
    const p = path.join(pp, `builds/${platform}@${c.runtime.scheme}`);
    if (fsExistsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};
