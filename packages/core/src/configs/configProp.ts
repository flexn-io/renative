import { GetConfigPropFn } from '../api/types';
import { RnvContext } from '../context/types';
import { logError } from '../logger';
import { ConfigFileBuildConfig } from '../schema';
import { ConfigProp, ConfigPropKey } from '../schema/types';
import { BuildConfigPropKey, BuildSchemePropKey, CommonPropKey, PlatPropKey, RnvPlatform } from '../types';

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
    c: RnvContext,
    platform: RnvPlatform,
    key: T,
    defaultVal?: ConfigProp[T]
): ConfigProp[T] => {
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return undefined;
    }
    return _getConfigProp<T>(c, platform, key, defaultVal, c.buildConfig);
};

export const _getConfigProp = <T extends ConfigPropKey>(
    c: RnvContext,
    platform: RnvPlatform,
    key: T,
    defaultVal?: ConfigProp[T],
    sourceObj?: Partial<ConfigFileBuildConfig>
): ConfigProp[T] => {
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
