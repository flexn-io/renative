import colorString from 'color-string';
import path from 'path';
import { fsExistsSync, writeCleanFile } from './system/fs';
import { chalk, logError, logWarning } from './logger';
import { RnvContext } from './context/types';
import { OverridesOptions, TimestampPathsConfig } from './system/types';
import { ConfigProp, ConfigPropKey } from './schema/types';
import { BuildConfigPropKey, BuildSchemePropKey, CommonPropKey, PlatPropKey, RnvPlatform } from './types';
import { ConfigFileBuildConfig } from './schema/configFiles/buildConfig';
import { GetConfigPropFn } from './api/types';

export const getTimestampPathsConfig = (c: RnvContext, platform: RnvPlatform): TimestampPathsConfig | undefined => {
    let timestampBuildFiles: Array<string> = [];
    const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
    if (platform === 'web') {
        timestampBuildFiles = (getConfigProp(c, platform, 'timestampBuildFiles') || []).map((v) => path.join(pPath, v));
    }
    if (timestampBuildFiles?.length && c.runtime.timestamp) {
        return { paths: timestampBuildFiles, timestamp: c.runtime.timestamp };
    }
    return undefined;
};

export const addSystemInjects = (c: RnvContext, injects: OverridesOptions) => {
    if (!c.systemPropsInjects) c.systemPropsInjects = [];
    if (injects) {
        injects.forEach((item) => {
            c.systemPropsInjects.push(item);
        });
    }
};

//TODO: make this as part of an advanced descriptor validation
export const sanitizeColor = (val: string | undefined, key: string) => {
    if (!val) {
        logWarning(`You are missing ${chalk().white(key)} in your renative config. will use default #FFFFFF instead`);
        return {
            rgb: [255, 255, 255, 1],
            rgbDecimal: [1, 1, 1, 1],
            hex: '#FFFFFF',
        };
    }

    const rgb = colorString.get.rgb(val);
    const hex = colorString.to.hex(rgb);

    return {
        rgb,
        rgbDecimal: rgb.map((v: number) => (v > 1 ? Math.round((v / 255) * 10) / 10 : v)),
        hex,
    };
};

export const getPlatformBuildDir = (c: RnvContext, isRelativePath?: boolean) => {
    if (!c.runtime.engine) {
        logError('getPlatformBuildDir not available without specific engine');
        return null;
    }
    return getAppFolder(c, isRelativePath);
};

export const getPlatformOutputDir = (c: RnvContext) => {
    if (!c.runtime.engine) {
        logError('getPlatformOutputDir not available without specific engine');
        return null;
    }
    return path.join(getAppFolder(c), c.runtime.engine.outputDirName || '');
};

export const getPlatformProjectDir = (c: RnvContext) => {
    if (!c.runtime.engine) {
        logError('getPlatformProjectDir not available without specific engine');
        return null;
    }
    return path.join(getAppFolder(c), c.runtime.engine.projectDirName || '');
};

export const getPlatformServerDir = (c: RnvContext) => {
    if (!c.runtime.engine) {
        logError('getPlatformProjectDir not available without specific engine');
        return null;
    }
    return path.join(getAppFolder(c), c.runtime.engine.serverDirName || '');
};

export const getTemplateDir = (c: RnvContext) =>
    c.platform ? path.join(c.paths.project.platformTemplatesDirs[c.platform], `${c.platform}`) : undefined;

export const getTemplateProjectDir = (c: RnvContext) => {
    if (!c.runtime.engine) {
        logError('getTemplateProjectDir not available without specific engine');
        return null;
    }
    if (!c.runtime.engine.projectDirName) {
        logError('c.runtime.engine.projectDirName missing');
        return null;
    }
    return path.join(getTemplateDir(c)!, c.runtime.engine.projectDirName);
};

// DEPRECATED
export const getAppFolder = (c: RnvContext, isRelativePath?: boolean) => {
    if (isRelativePath) {
        return `platformBuilds/${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`;
    }
    return path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${c.platform}${c.runtime._platformBuildsSuffix || ''}`
    );
};

// DEPRECATED
export const getAppTemplateFolder = (c: RnvContext, platform: RnvPlatform) =>
    platform ? path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`) : undefined;

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

export const getBuildsFolder = (c: RnvContext, platform: RnvPlatform, customPath?: string) => {
    const pp = customPath || c.paths.appConfig.dir;
    // if (!fsExistsSync(pp)) {
    //     logWarning(`Path ${chalk().white(pp)} does not exist! creating one for you..`);
    // }
    if (!pp) {
        logWarning(
            `getBuildsFolder: Path ${chalk().white(
                'c.paths.appConfig.dir'
            )} not defined! can't return path. You might not be in renative project`
        );
        return null;
    }
    const p = path.join(pp, `builds/${platform}@${c.runtime.scheme}`);
    if (fsExistsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};

export const getFlavouredProp = <T, K extends keyof T>(c: RnvContext, obj: T, key: K): T[K] | undefined => {
    if (!key || !obj || typeof key !== 'string') return undefined;
    const keyScoped = `${key}@${c.runtime.scheme}` as K;
    const val1 = obj[keyScoped];
    if (val1) return val1;
    return obj[key];
};

export default {
    getBuildsFolder,
    getAppFolder,
    getAppTemplateFolder,
    writeCleanFile,
    getConfigProp,
};
