/* eslint-disable import/no-cycle */
import killPort from 'kill-port';
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
import { PLATFORMS } from './constants';
import { inquirerPrompt } from '../cli/prompt';

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

export const getCliArguments = (c) => {
    const { args, rawArgs } = c.program;
    const argsCopy = [...args];
    let missingArg = rawArgs[rawArgs.indexOf(argsCopy[1]) + 1];
    if (missingArg?.[0] === '-') {
        if (rawArgs[rawArgs.indexOf(argsCopy[1]) + 2]) {
            missingArg = rawArgs[rawArgs.indexOf(argsCopy[1]) + 2];
        } else {
            missingArg = undefined;
        }
    }
    if (rawArgs.length === 3) missingArg = undefined;
    argsCopy[2] = missingArg;
    return argsCopy.filter(arg => !!arg);
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

export const confirmActiveBundler = async (c) => {
    if (c.runtime.skipActiveServerCheck) return true;

    const choices = ['Restart the server (recommended)', 'Use existing session'];

    const { selectedOption } = await inquirerPrompt({
        name: 'selectedOption',
        type: 'list',
        choices,
        warningMessage: `Another ${c.platform} server at port ${
            chalk().white(c.runtime.port)
        } already running`
    });

    if (choices[0] === selectedOption) {
        await killPort(c.runtime.port);
    } else {
        return false;
    }
    return true;
};

export const getPlatformBuildDir = (c) => {
    if (!c.runtime.engine) {
        logError('getPlatformBuildDir not available without specific engine');
        return null;
    }
    return c.runtime.engine.getPlatformBuildDir(c);
};

export const getPlatformOutputDir = (c) => {
    if (!c.runtime.engine) {
        logError('getPlatformOutputDir not available without specific engine');
        return null;
    }
    return c.runtime.engine.getPlatformOutputDir(c);
};

export const getPlatformProjectDir = (c) => {
    if (!c.runtime.engine) {
        logError('getPlatformProjectDir not available without specific engine');
        return null;
    }
    return c.runtime.engine.getPlatformProjectDir(c);
};

export const getTemplateDir = c => path.join(
    c.paths.project.platformTemplatesDirs[c.platform], `${c.platform}`
);

export const getTemplateProjectDir = (c) => {
    if (!c.runtime.engine) {
        logError('getTemplateProjectDir not available without specific engine');
        return null;
    }
    return c.runtime.engine.getTemplateProjectDir(c);
};

// DEPRECATED
export const getAppFolder = c => path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}`);

// DEPRECATED
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

export const getConfigProp = (c, platform, key, defaultVal) => {
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return null;
    }
    return _getConfigProp(c, platform, key, defaultVal, c.buildConfig);
};

export const _getConfigProp = (c, platform, key, defaultVal, sourceObj) => {
    if (!sourceObj) return null;

    if (!key || !key.split) {
        logError('getConfigProp: invalid key!');
        return null;
    }
    const p = sourceObj.platforms?.[platform];
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
            sourceObj.platforms[platform],
            baseKey
        );
    }

    scheme = scheme || {};
    const resultCli = CLI_PROPS.includes(baseKey) ? c.program[baseKey] : undefined;
    const resultScheme = scheme[baseKey];
    const resultCommon = getFlavouredProp(c, sourceObj.common, baseKey);

    let result = _getValueOrMergedObject(
        resultCli,
        resultScheme,
        resultPlatforms,
        resultCommon
    );
    if (result === undefined || result === null) result = defaultVal; // default the value only if it's not specified in any of the files. i.e. undefined
    if (typeof result === 'object' && subKey.length) {
        return lGet(result, subKey);
    }
    return result;
};


export const getConfigPropArray = (c, platform, key) => {
    const result = [];
    const configArr = [
        c.files.defaultWorkspace.config,
        c.files.rnv.projectTemplates.config,
        // { plugins: extraPlugins },
        // { pluginTemplates },
        c.files.rnv.engines.config,
        c.files.workspace.config,
        c.files.workspace.configPrivate,
        c.files.workspace.configLocal,
        c.files.workspace.project.config,
        c.files.workspace.project.configPrivate,
        c.files.workspace.project.configLocal,
        ...c.files.workspace.appConfig.configs,
        ...c.files.workspace.appConfig.configsPrivate,
        ...c.files.workspace.appConfig.configsLocal,
        c.files.project.config,
        c.files.project.configPrivate,
        c.files.project.configLocal,
        ...c.files.appConfig.configs,
        ...c.files.appConfig.configsPrivate,
        ...c.files.appConfig.configsLocal
    ];
    configArr.forEach((config) => {
        const val = _getConfigProp(c, platform, key, null, config);
        if (val) {
            result.push(val);
        }
    });


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
    const versionCodeFormat = getConfigProp(c, platform, 'versionCodeFormat', '00.00.00');
    const vFormatArr = versionCodeFormat.split('.').map(v => v.length);
    const versionCodeMaxCount = vFormatArr.length;

    const verArr = [];
    version.split('.').map(v => v.split('-').map(v2 => v2.split('+').forEach((v3) => {
        const asNumber = Number(v3);
        if (!Number.isNaN(asNumber)) {
            let val = v3;
            const maxDigits = vFormatArr[verArr.length - 1] || 2;
            if (v3.length > maxDigits) {
                val = v3.substr(0, maxDigits);
            } else if (v3.length < maxDigits) {
                let toAdd = maxDigits - v3.length;
                while (toAdd > 0) {
                    val = `0${v3}`;
                    toAdd--;
                }
            }
            verArr.push(val);
        }
    })));
    let verCountDiff = verArr.length - versionCodeMaxCount;
    if (verCountDiff < 0) {
        while (verCountDiff < 0) {
            let extraVersionLen = vFormatArr[versionCodeMaxCount + verCountDiff];
            let num = '';
            while (extraVersionLen) {
                num += '0';
                extraVersionLen--;
            }
            verArr.push(num);
            verCountDiff++;
        }
    }
    const output = Number(verArr.join('')).toString();
    // console.log(`IN: ${version}\nOUT: ${output}`);
    return output;
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
    if (port === undefined || port === null) {
        resolve(false);
        return;
    }
    detectPort(port, (err, availablePort) => {
        if (err) {
            reject(err);
            return;
        }
        const result = parseInt(port, 10) !== parseInt(availablePort, 10);
        resolve(result);
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
        getBuildsFolder(c, platform, c.paths.project.appConfigBase.dir),
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
