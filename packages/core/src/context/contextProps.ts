import { chalk, logError, logWarning } from '../logger';
import type {
    BuildConfigKey,
    CommonBuildSchemeKey,
    CommonPropKey,
    ConfigFileBuildConfig,
    ConfigPropKeyMerged,
    ConfigPropRootKeyMerged,
    GetConfigPropVal,
    GetConfigRootPropVal,
    PlatformBuildSchemeKey,
    RnvCommonBuildSchemeSchema,
} from '../schema/types';
import type { TimestampPathsConfig } from '../system/types';
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

export const getConfigRootProp = <T, K extends ConfigPropRootKeyMerged<T>>(key: K): GetConfigRootPropVal<T, K> => {
    const c = getContext();
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return undefined;
    }
    return c.buildConfig[key];
};

export const getConfigProp = <T, K extends ConfigPropKeyMerged<T>>(
    key: K,
    obj?: Partial<ConfigFileBuildConfig>
): GetConfigPropVal<T, K> => {
    const c = getContext();
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return undefined;
    }

    const { platform } = c;
    const sourceObj = obj || c.buildConfig;
    if (!sourceObj || !platform) return undefined;

    const platformObj = sourceObj.platforms?.[platform];
    const ps = c.runtime.scheme;
    // const baseKey = key as PlatPropKey;

    let resultPlatforms;
    let scheme;
    if (platformObj && ps) {
        scheme = platformObj.buildSchemes?.[ps] || {};
        resultPlatforms = getFlavouredProp(platformObj, key as any);
    } else {
        scheme = {};
    }

    const resultCommonRoot = getFlavouredProp(sourceObj.common || {}, key as CommonPropKey);

    const bs: RnvCommonBuildSchemeSchema =
        (!!c.runtime.scheme && sourceObj.common?.buildSchemes?.[c.runtime.scheme]) || {};

    const resultCommonScheme = c.runtime.scheme && getFlavouredProp(bs, key as CommonBuildSchemeKey);

    const resultCommon = resultCommonScheme || resultCommonRoot;

    const resultScheme = key && scheme[key as PlatformBuildSchemeKey];
    let result: GetConfigPropVal<T, K> = _getValueOrMergedObject(
        resultScheme,
        resultPlatforms,
        resultCommon
    ) as GetConfigPropVal<T, K>;
    if (result === undefined) {
        result = getFlavouredProp(sourceObj, key as BuildConfigKey);
    }

    return result as GetConfigPropVal<T, K>;
};

export const getFlavouredProp = <T, K extends keyof T>(obj: T, key: K): T[K] | undefined => {
    const c = getContext();
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
