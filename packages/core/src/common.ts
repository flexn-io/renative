import colorString from 'color-string';
import detectPort from 'detect-port';
import ip from 'ip';
import killPort from 'kill-port';
import axios from 'axios';
import lGet from 'lodash.get';
import path from 'path';
import { CLI_PROPS } from './constants';
import { fsExistsSync, writeCleanFile } from './system/fs';
import { chalk, logError, logTask, logWarning } from './logger';
import { getValidLocalhost } from './utils/utils';
import { RnvContext } from './context/types';
import { OverridesOptions, TimestampPathsConfig } from './system/types';
import { ConfigProp } from './schema/types';
import { inquirerPrompt } from './api';
import { RnvPlatform } from './types';

export const getTimestampPathsConfig = (c: RnvContext, platform: RnvPlatform): TimestampPathsConfig | undefined => {
    let timestampBuildFiles: Array<string> = [];
    const pPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);
    if (platform === 'web') {
        timestampBuildFiles = (getConfigProp(c, platform, 'timestampBuildFiles') || []).map((v) => path.join(pPath, v));
    }
    if (timestampBuildFiles?.length) {
        return { paths: timestampBuildFiles, timestamp: c.runtime.timestamp };
    }
    return undefined;
};

export const getCliArguments = (c: RnvContext) => {
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
    return argsCopy.filter((arg) => !!arg);
};

export const addSystemInjects = (c: RnvContext, injects: OverridesOptions) => {
    if (!c.systemPropsInjects) c.systemPropsInjects = [];
    if (injects) {
        injects.forEach((item) => {
            c.systemPropsInjects.push(item);
        });
    }
};

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

export const getDevServerHost = (c: RnvContext) => {
    const devServerHostOrig = getConfigProp(c, c.platform, 'devServerHost');

    const devServerHostFixed = devServerHostOrig
        ? getValidLocalhost(devServerHostOrig, c.runtime.localhost)
        : undefined;

    return devServerHostFixed;
};

export const waitForHost = async (c: RnvContext, suffix = 'assets/bundle.js') => {
    logTask('waitForHost', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost(c);
    const url = `http://${devServerHost}:${c.runtime.port}/${suffix}`;

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            axios
                .get(url)
                .then((res) => {
                    if (res.status === 200) {
                        clearInterval(interval);
                        // spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(`Can't connect to host ${url}. Try restarting it.`);
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(`Can't connect to host ${url}. Try restarting it.`);
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const existBuildsOverrideForTargetPathSync = (c: RnvContext, destPath: string) => {
    const appFolder = getAppFolder(c);
    const relativePath = path.relative(appFolder, destPath);
    let result = false;

    const pathsToCheck: Array<string> = [];

    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const bf = getBuildsFolder(c, c.platform, v);
            if (bf) pathsToCheck.push();
        });
    }

    for (let i = 0; i < pathsToCheck.length; i++) {
        if (fsExistsSync(path.join(pathsToCheck[i], relativePath))) {
            result = true;
            break;
        }
    }
    return result;
};

export const confirmActiveBundler = async (c: RnvContext) => {
    if (c.runtime.skipActiveServerCheck) return true;

    if (c.program.ci) {
        //TODO: handle return codes properly
        await killPort(c.runtime.port);
        return true;
    }

    const choices = ['Restart the server (recommended)', 'Use existing session'];

    const { selectedOption } = await inquirerPrompt({
        name: 'selectedOption',
        type: 'list',
        choices,
        warningMessage: `Another ${c.platform} server at port ${chalk().white(c.runtime.port)} already running`,
    });

    if (choices[0] === selectedOption) {
        await killPort(c.runtime.port);
    } else {
        return false;
    }
    return true;
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

const _getValueOrMergedObject = (resultCli: any, resultScheme: any, resultPlatforms: any, resultCommon: any) => {
    if (resultCli !== undefined) {
        return resultCli;
    }
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
    if (resultPlatforms === null) return null;
    return resultCommon;
};

export const getConfigProp = <T extends keyof ConfigProp>(
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

type PlatformGeneric =
    | {
          buildSchemes?: Record<string, any>;
      }
    | undefined;

export const _getConfigProp = <T extends keyof ConfigProp>(
    c: RnvContext,
    platform: RnvPlatform,
    key: T,
    defaultVal?: ConfigProp[T],
    sourceObj?: Partial<RenativeConfigFile>
): ConfigProp[T] => {
    if (!sourceObj || !platform) return undefined;

    if (!key || !key.split) {
        logError('getConfigProp: invalid key!');
        return null;
    }

    const platformObj: PlatformGeneric = sourceObj.platforms?.[platform];
    const ps = c.runtime.scheme;
    const keyArr = key.split('.');
    const baseKey = keyArr.shift() || '';
    const subKey = keyArr.join('.');

    let resultPlatforms;
    let scheme;
    if (platformObj) {
        scheme = platformObj.buildSchemes?.[ps] || {};
        resultPlatforms = getFlavouredProp(c, platformObj, baseKey);
    } else {
        scheme = {};
    }

    const resultCli = baseKey && CLI_PROPS.includes(baseKey) ? c.program[baseKey] : undefined;
    const resultScheme = baseKey && scheme[baseKey];
    const resultCommonRoot = getFlavouredProp(c, sourceObj.common || {}, baseKey);
    const resultCommonScheme = getFlavouredProp(c, sourceObj.common?.buildSchemes?.[c.runtime.scheme] || {}, baseKey);
    const resultCommon = resultCommonScheme || resultCommonRoot;

    let result = _getValueOrMergedObject(resultCli, resultScheme, resultPlatforms, resultCommon);
    if (result === undefined || result === null) {
        result = getFlavouredProp(c, sourceObj, baseKey);
    }

    if (result === undefined || result === null) result = defaultVal; // default the value only if it's not specified in any of the files. i.e. undefined
    if (typeof result === 'object' && subKey.length) {
        return lGet(result, subKey);
    }
    return result as ConfigProp[T];
};

export const getConfigPropArray = <T extends keyof ConfigProp>(c: RnvContext, platform: RnvPlatform, key: T) => {
    const result: Array<ConfigProp[T]> = [];
    const configArr = [
        c.files.defaultWorkspace.config,
        c.files.rnv.projectTemplates.config,
        // { plugins: extraPlugins },
        // { pluginTemplates },
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
        ...c.files.appConfig.configsLocal,
    ];
    configArr.forEach((config) => {
        const val = _getConfigProp(c, platform, key, null, config);
        if (val) {
            result.push(val);
        }
    });

    return result;
};

export const getAppId = (c: RnvContext, platform: RnvPlatform) => {
    const id = getConfigProp(c, platform, 'id');
    const idSuffix = getConfigProp(c, platform, 'idSuffix');
    return idSuffix ? `${id}${idSuffix}` : id;
};

export const getAppTitle = (c: RnvContext, platform: RnvPlatform) => getConfigProp(c, platform, 'title');

export const getAppAuthor = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'author') || c.files.project.package?.author;

export const getAppLicense = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'license') || c.files.project.package?.license;

export const getEntryFile = (c: RnvContext, platform: RnvPlatform) =>
    platform ? c.buildConfig.platforms?.[platform]?.entryFile : undefined;

export const getGetJsBundleFile = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'getJsBundleFile');

export const getAppDescription = (c: RnvContext, platform: RnvPlatform) =>
    getConfigProp(c, platform, 'description') || c.files.project.package?.description;

export const getAppVersion = (c: RnvContext, platform: RnvPlatform) => {
    const version = getConfigProp(c, platform, 'version') || c.files.project.package?.version;
    if (!version) {
        logWarning('You are missing version prop in your config. will default to 0');
        return '0';
    }
    const versionFormat = getConfigProp(c, platform, 'versionFormat');
    if (!versionFormat) return version;
    const versionCodeArr = versionFormat.split('.');
    const dotLength = versionCodeArr.length;
    const isNumArr = versionCodeArr.map((v: string) => !Number.isNaN(Number(v)));

    const verArr: Array<string> = [];
    let i = 0;
    version.split('.').map((v: string) =>
        v.split('-').map((v2) =>
            v2.split('+').forEach((v3) => {
                const isNum = !Number.isNaN(Number(v3));
                if (isNumArr[i] && isNum) {
                    verArr.push(v3);
                } else if (!isNumArr[i]) {
                    verArr.push(v3);
                }

                i++;
            })
        )
    );
    if (verArr.length > dotLength) {
        verArr.length = dotLength;
    }

    const output = verArr.join('.');
    // console.log(`IN: ${version}\nOUT: ${output}`);
    return output;
};

export const getAppVersionCode = (c: RnvContext, platform: RnvPlatform) => {
    const versionCode = getConfigProp(c, platform, 'versionCode');
    if (versionCode) return versionCode;
    const version = getConfigProp(c, platform, 'version') || c.files.project.package?.version;
    if (!version || typeof version !== 'string') {
        logWarning('You are missing version prop in your config. will default to 0');
        return '0';
    }
    const versionCodeFormat = getConfigProp(c, platform, 'versionCodeFormat') || '00.00.00';
    const vFormatArr = versionCodeFormat.split('.').map((v: string) => v.length);
    const versionCodeMaxCount = vFormatArr.length;
    const verArr = [];

    version.split('.').map((v) =>
        v.split('-').map((v2) =>
            v2.split('+').forEach((v3) => {
                const asNumber = Number(v3);
                if (!Number.isNaN(asNumber)) {
                    let val = v3;
                    const maxDigits = vFormatArr[verArr.length] || 2;

                    if (v3.length > maxDigits) {
                        val = v3.substr(0, maxDigits);
                    } else if (v3.length < maxDigits) {
                        let toAdd = maxDigits - v3.length;
                        val = v3;
                        while (toAdd > 0) {
                            val = `0${val}`;
                            toAdd--;
                        }
                    }
                    verArr.push(val);
                }
            })
        )
    );
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

export const getIP = () => ip.address();

export const checkPortInUse = (c: RnvContext, platform: RnvPlatform, port: number) =>
    new Promise((resolve, reject) => {
        if (port === undefined || port === null) {
            resolve(false);
            return;
        }
        detectPort(port, (err: string, availablePort: string) => {
            if (err) {
                reject(err);
                return;
            }
            const result = port !== parseInt(availablePort, 10);
            resolve(result);
        });
    });

export const getFlavouredProp = <T = unknown>(
    c: RnvContext,
    obj: Record<string, any> | undefined,
    key: string
): T | null => {
    if (!key || !obj) return null;
    const val1 = obj[`${key}@${c.runtime.scheme}`];
    if (val1) return val1;
    return obj[key];
};

export const getBuildFilePath = (
    c: RnvContext,
    platform: RnvPlatform,
    filePath: string,
    altTemplateFolder?: string
) => {
    // P1 => platformTemplates
    let sp = path.join(altTemplateFolder || getAppTemplateFolder(c, platform)!, filePath);
    // P2 => appConfigs/base + @buildSchemes
    const sp2bf = getBuildsFolder(c, platform, c.paths.project.appConfigBase.dir);
    if (sp2bf) {
        const sp2 = path.join(sp2bf, filePath);
        if (fsExistsSync(sp2)) sp = sp2;
    }

    // P3 => appConfigs + @buildSchemes
    const sp3bf = getBuildsFolder(c, platform);

    if (sp3bf) {
        const sp3 = path.join(sp3bf, filePath);
        if (fsExistsSync(sp3)) sp = sp3;
    }

    return sp;
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
};
