/* eslint-disable import/no-cycle */
import path from 'path';
import detectPort from 'detect-port';
import ip from 'ip';
import axios from 'axios';
import lGet from 'lodash.get';
import colorString from 'color-string';
import { doResolve } from './resolve';
import { fsExistsSync, writeCleanFile } from './systemManager/fileutils';
import {
    chalk,
    logError,
    logTask,
    logWarning,
    logDebug,
    logSuccess
} from './systemManager/logger';
import {
    IOS,
    TVOS,
    PLATFORMS
} from './constants';
import { generateOptions, inquirerPrompt } from '../cli/prompt';


export const getTimestampPathsConfig = (c, platform) => {
    let timestampBuildFiles;
    const pPath = path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${platform}`
    );
    if (platform === 'web') {
        timestampBuildFiles = getConfigProp(c, platform, 'timestampBuildFiles', []).map((v => path.join(pPath, v)));
    }
    if (timestampBuildFiles?.length) {
        return { paths: timestampBuildFiles, timestamp: c.runtime.timestamp };
    }
    return null;
};

export const getSourceExts = (c, p, isServer, prefix = '') => {
    // IMPORTANT: do not replace "p" with c.platform as this has to
    // be injected from above to generate multiple configs
    const sExt = PLATFORMS[p]?.sourceExts;
    if (sExt) {
        return [...sExt.factors, ...sExt.platforms, ...sExt.fallbacks].map(v => `${prefix}${v}`).filter(ext => isServer || !ext.includes('server.'));
    }
    return [];
};

export const getSourceExtsAsString = (c, p) => {
    const sourceExts = getSourceExts(c, p);
    return sourceExts.length ? `['${sourceExts.join("','")}']` : '[]';
};

export const addSystemInjects = (c, injects) => {
    if (!c.systemPropsInjects) c.systemPropsInjects = [];
    if (injects) {
        injects.forEach((item) => {
            c.systemPropsInjects.push(item);
        });
    }
};

export const sanitizeColor = (val, key) => {
    if (!val) {
        logWarning(
            `You are missing ${chalk().white(key)} in your renative config. will use default #FFFFFF instead`
        );
        return {
            rgb: [255, 255, 255, 1],
            rgbDecimal: [1, 1, 1, 1],
            hex: '#FFFFFF'
        };
    }

    const rgb = colorString.get.rgb(val);
    const hex = colorString.to.hex(rgb);

    return {
        rgb,
        rgbDecimal: rgb.map(v => (v > 1 ? Math.round((v / 255) * 10) / 10 : v)),
        hex
    };
};

export const isBuildSchemeSupported = async (c) => {
    logTask('isBuildSchemeSupported');

    const { scheme } = c.program;

    if (!c.buildConfig.platforms[c.platform]) {
        c.buildConfig.platforms[c.platform] = {};
    }

    const { buildSchemes } = c.buildConfig.platforms[c.platform];

    if (!buildSchemes) {
        logWarning(
            `Your appConfig for platform ${
                c.platform
            } has no buildSchemes. Will continue with defaults`
        );
        return false;
    }

    const schemeDoesNotExist = scheme && !buildSchemes[scheme];
    if (scheme === true || schemeDoesNotExist) {
        if (schemeDoesNotExist && scheme && scheme !== true) {
            logError('Build scheme you picked does not exists.');
        }
        const opts = generateOptions(buildSchemes);

        const { selectedScheme } = await inquirerPrompt({
            name: 'selectedScheme',
            type: 'list',
            message: 'Pick one of available buildSchemes',
            choices: opts.keysAsArray,
            logMessage: 'You need to specify scheme'
        });

        c.program.scheme = selectedScheme;
        return selectedScheme;
    }
    return scheme;
};

export const confirmActiveBundler = async (c) => {
    if (c.runtime.skipActiveServerCheck) return true;
    const { confirm } = await inquirerPrompt({
        type: 'confirm',
        message: 'It will be used for this session. Continue?',
        warningMessage: `Another ${c.platform} server at port ${
            c.runtime.port
        } already running`
    });

    if (confirm) return true;
    return Promise.reject('Cancelled by user');
};

export const getAppFolder = (c, platform) => path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);

export const getAppSubFolder = (c, platform) => {
    let subFolder = '';
    if (platform === IOS) subFolder = 'RNVApp';
    else if (platform === TVOS) subFolder = 'RNVAppTVOS';
    return path.join(getAppFolder(c, platform), subFolder);
};

export const getAppTemplateFolder = (c, platform) => path.join(
    c.paths.project.platformTemplatesDirs[platform], `${platform}`
);

export const CLI_PROPS = [
    'provisioningStyle',
    'codeSignIdentity',
    'provisionProfileSpecifier'
];

const _getValueOrMergedObject = (
    resultCli,
    resultScheme,
    resultPlatforms,
    resultCommon
) => {
    if (resultCli !== undefined) {
        return resultCli;
    }
    if (resultScheme !== undefined) {
        if (Array.isArray(resultScheme) || typeof resultScheme !== 'object') { return resultScheme; }
        const val = Object.assign(
            resultCommon || {},
            resultPlatforms || {},
            resultScheme
        );
        return val;
    }
    if (resultPlatforms !== undefined) {
        if (
            Array.isArray(resultPlatforms)
            || typeof resultPlatforms !== 'object'
        ) { return resultPlatforms; }
        return Object.assign(resultCommon || {}, resultPlatforms);
    }
    if (resultPlatforms === null) return null;
    return resultCommon;
};

// We need to slowly move this to Config and refactor everything to use it from there
export const getConfigProp = (c, platform, key, defaultVal) => {
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return null;
    }
    if (!key || !key.split) {
        logError('getConfigProp: invalid key!');
        return null;
    }
    const p = c.buildConfig.platforms?.[platform];
    const ps = c.runtime.scheme;
    const keyArr = key.split('.');
    const baseKey = keyArr.shift();
    const subKey = keyArr.join('.');

    let resultPlatforms;
    let scheme;
    if (p) {
        scheme = p.buildSchemes ? p.buildSchemes[ps] : undefined;
        resultPlatforms = getFlavouredProp(
            c,
            c.buildConfig.platforms[platform],
            baseKey
        );
    }

    scheme = scheme || {};
    const resultCli = CLI_PROPS.includes(baseKey) ? c.program[baseKey] : undefined;
    const resultScheme = scheme[baseKey];
    const resultCommon = getFlavouredProp(c, c.buildConfig.common, baseKey);

    let result = _getValueOrMergedObject(
        resultCli,
        resultScheme,
        resultPlatforms,
        resultCommon
    );

    if (result === undefined) result = defaultVal; // default the value only if it's not specified in any of the files. i.e. undefined
    logDebug(`getConfigProp:${key}:${result}`);
    if (typeof result === 'object' && subKey.length) {
        return lGet(result, subKey);
    }
    return result;
};

export const getAppId = (c, platform) => {
    const id = getConfigProp(c, platform, 'id');
    const idSuffix = getConfigProp(c, platform, 'idSuffix');
    return idSuffix ? `${id}${idSuffix}` : id;
};

export const getAppTitle = (c, platform) => getConfigProp(c, platform, 'title');

export const getAppVersion = (c, platform) => getConfigProp(c, platform, 'version') || c.files.project.package?.version;

export const getAppAuthor = (c, platform) => getConfigProp(c, platform, 'author') || c.files.project.package?.author;

export const getAppLicense = (c, platform) => getConfigProp(c, platform, 'license') || c.files.project.package?.license;

export const getEntryFile = (c, platform) => c.buildConfig.platforms?.[platform]?.entryFile;

export const getGetJsBundleFile = (c, platform) => getConfigProp(c, platform, 'getJsBundleFile');

export const getAppDescription = (c, platform) => getConfigProp(c, platform, 'description')
    || c.files.project.package?.description;

export const getAppVersionCode = (c, platform) => {
    const versionCode = getConfigProp(c, platform, 'versionCode');
    if (versionCode) return versionCode;

    const version = getAppVersion(c, platform);

    let vc = '';
    version
        .split('-')[0]
        .split('.')
        .forEach((v) => {
            vc += v.length > 1 ? v : `0${v}`;
        });
    return Number(vc).toString();
};

export const isMonorepo = () => {
    try {
        fsExistsSync(path.resolve(__dirname, '../../../../lerna.json'));
        return true;
    } catch (_err) {
        return false;
    }
};

export const getMonorepoRoot = () => {
    if (isMonorepo()) {
        return path.resolve(__dirname, '../../../..');
    }
};

export const areNodeModulesInstalled = () => !!doResolve('resolve', false);

export const getBuildsFolder = (c, platform, customPath) => {
    const pp = customPath || c.paths.appConfig.dir;
    // if (!fsExistsSync(pp)) {
    //     logWarning(`Path ${chalk().white(pp)} does not exist! creating one for you..`);
    // }
    const p = path.join(pp, `builds/${platform}@${c.runtime.scheme}`);
    if (fsExistsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};

export const getIP = () => ip.address();

export const checkPortInUse = (c, platform, port) => new Promise((resolve, reject) => {
    detectPort(port, (err, availablePort) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(parseInt(port, 10) !== parseInt(availablePort, 10));
    });
});

export const getFlavouredProp = (c, obj, key) => {
    if (!key || !obj) return null;
    const val1 = obj[`${key}@${c.runtime.scheme}`];
    if (val1) return val1;
    return obj[key];
};

export const getBuildFilePath = (c, platform, filePath) => {
    // P1 => platformTemplates
    let sp = path.join(getAppTemplateFolder(c, platform), filePath);
    // P2 => appConfigs/base + @buildSchemes
    const sp2 = path.join(
        getBuildsFolder(c, platform, c.paths.project.projectConfig.dir),
        filePath
    );
    if (fsExistsSync(sp2)) sp = sp2;
    // P3 => appConfigs + @buildSchemes
    const sp3 = path.join(getBuildsFolder(c, platform), filePath);
    if (fsExistsSync(sp3)) sp = sp3;
    return sp;
};

export const waitForUrl = url => new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    const interval = setInterval(() => {
        axios.get(url)
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                attempts++;
                if (attempts > maxAttempts) {
                    clearInterval(interval);
                    // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                    return reject(
                        "Can't connect to webpack. Try restarting it."
                    );
                }
            });
    }, CHECK_INTEVAL);
});

export const importPackageFromProject = (name) => {
    // const c = Config.getConfig();
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const pkg = require(doResolve(name));
    if (pkg.default) return pkg.default;
    return pkg;
};

export default {
    getBuildFilePath,
    getBuildsFolder,
    isBuildSchemeSupported,
    getAppFolder,
    getAppTemplateFolder,
    getAppId,
    getAppTitle,
    getAppVersion,
    getAppVersionCode,
    writeCleanFile,
    getEntryFile,
    getGetJsBundleFile,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    getConfigProp,
    getIP,
    checkPortInUse,
    logTask: (val) => {
        logError(
            'DEPRECATED: Common.logTask() has been removed. use Logger.logTask() instead'
        );
        logTask(val);
    },
    logWarning: (val) => {
        logError(
            'DEPRECATED: Common.logWarning() has been removed. use Logger.logWarning() instead'
        );
        logWarning(val);
    },
    logError: (val) => {
        logError(
            'DEPRECATED: Common.logError() has been removed. use Logger.logError() instead'
        );
        logError(val);
    },
    logSuccess: (val) => {
        logError(
            'DEPRECATED: Common.logError() has been removed. use Logger.logError() instead'
        );
        logSuccess(val);
    },
    logDebug: (val) => {
        logError(
            'DEPRECATED: Common.logDebug() has been removed. use Logger.logDebug() instead'
        );
        logDebug(val);
    }
};
