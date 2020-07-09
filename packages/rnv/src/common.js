/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import detectPort from 'detect-port';
import ora from 'ora';
import ip from 'ip';
import axios from 'axios';
import lGet from 'lodash.get';
// import resolve from 'resolve';
import colorString from 'color-string';
import crypto from 'crypto';
import { doResolve } from './resolve';
import { getValidLocalhost } from './utils';
import { createPlatformBuild, cleanPlatformBuild } from './platformTools';
import CLI from './cli';
import {
    configureLogger,
    logError,
    logTask,
    logWarning,
    logInfo,
    logInitialize,
    logDebug,
    logSuccess
} from './systemTools/logger';
import {
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TIZEN_MOBILE,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    PLATFORMS
} from './constants';
import { execCLI } from './systemTools/exec';
import { createRnvConfig } from './configTools/configParser';
import { cleanPlaformAssets } from './projectTools/projectParser';
import { generateOptions, inquirerPrompt } from './systemTools/prompt';
import { writeCleanFile } from './systemTools/fileutils';
import Config from './config';

export const initializeBuilder = async (cmd, subCmd, process, program) => {
    const c = createRnvConfig(program, process, cmd, subCmd);

    configureLogger(
        c,
        c.process,
        c.command,
        c.subCommand,
        program.info === true
    );
    logInitialize();

    return c;
};

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

export const generateChecksum = (str, algorithm, encoding) => crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');

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

export const sanitizeColor = (val, key) => {
    if (!val) {
        logWarning(
            `You are missing ${chalk.white(key)} in your renative config. will use default #FFFFFF instead`
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
    logTask(`isBuildSchemeSupported:${c.platform}`);

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

    let result = Config.getValueOrMergedObject(
        resultCli,
        resultScheme,
        resultPlatforms,
        resultCommon
    );

    if (result === undefined) result = defaultVal; // default the value only if it's not specified in any of the files. i.e. undefined
    logDebug(`getConfigProp:${platform}:${key}:${result}`);
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

export const logErrorPlatform = (c, platform) => {
    logError(
        `Platform: ${chalk.white(
            platform
        )} doesn't support command: ${chalk.white(c.command)}`,
        true // kill it if we're not supporting this
    );
};

export const PLATFORM_RUNS = {};

export const configureIfRequired = async (c, platform) => {
    logTask(`configureIfRequired:${platform}`);

    if (PLATFORM_RUNS[platform]) {
        return;
    }
    PLATFORM_RUNS[platform] = true;
    const { device } = c.program;
    const nc = {
        command: 'configure',
        program: {
            appConfig: c.id,
            update: false,
            platform,
            device
        }
    };

    if (c.program.reset) {
        await cleanPlatformBuild(c, platform);
    }

    if (c.program.resetHard) {
        await cleanPlaformAssets(c);
    }
    await createPlatformBuild(c, platform);
    await CLI(c, nc);
};

export const getBinaryPath = (c, platform) => {
    const appFolder = getAppFolder(c, platform);
    const id = getConfigProp(c, platform, 'id');
    const signingConfig = getConfigProp(c, platform, 'signingConfig', 'debug');
    const version = getAppVersion(c, platform);
    const productName = 'ReNative - macos';
    const appName = getConfigProp(c, platform, 'appName');

    switch (platform) {
        case IOS:
        case TVOS:
            return `${appFolder}/release/RNVApp.ipa`;
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return `${appFolder}/app/build/outputs/apk/${signingConfig}/app-${signingConfig}.apk`;
        case WEB:
            return `${appFolder}/public`;
        case MACOS:
        case WINDOWS:
            return `${appFolder}/build/release/${productName}-${version}`;
        case TIZEN:
        case TIZEN_MOBILE:
            return `${appFolder}/output/${appName}.wgt`;
        case WEBOS:
            return `${appFolder}/output/${id}_${version}_all.ipk`;
        default:
            return appFolder;
    }
};

export const isMonorepo = () => {
    try {
        fs.existsSync(path.resolve(__dirname, '../../../lerna.json'));
        return true;
    } catch (_err) {
        return false;
    }
};

export const getMonorepoRoot = () => {
    if (isMonorepo()) {
        return path.resolve(__dirname, '../../..');
    }
};

export const areNodeModulesInstalled = () => !!doResolve('resolve', false);

export const getBuildsFolder = (c, platform, customPath) => {
    const pp = customPath || c.paths.appConfig.dir;
    // if (!fs.existsSync(pp)) {
    //     logWarning(`Path ${chalk.white(pp)} does not exist! creating one for you..`);
    // }
    const p = path.join(pp, `builds/${platform}@${c.runtime.scheme}`);
    if (fs.existsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};

export const getIP = () => ip.address();

export const cleanPlatformIfRequired = async (c, platform) => {
    if (c.program.reset) {
        logInfo(
            `You passed ${chalk.white('-r')} argument. paltform ${chalk.white(
                platform
            )} will be cleaned up first!`
        );
        await cleanPlatformBuild(c, platform);
    }
};

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
    if (fs.existsSync(sp2)) sp = sp2;
    // P3 => appConfigs + @buildSchemes
    const sp3 = path.join(getBuildsFolder(c, platform), filePath);
    if (fs.existsSync(sp3)) sp = sp3;
    return sp;
};

export const waitForEmulator = async (c, cli, command, callback) => {
    let attempts = 0;
    const maxAttempts = 30;
    const CHECK_INTEVAL = 2000;
    const { maxErrorLength } = c.program;
    const spinner = ora('Waiting for emulator to boot...').start();

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            execCLI(c, cli, command, {
                silent: true,
                timeout: 10000,
                maxErrorLength
            })
                .then((resp) => {
                    if (callback(resp)) {
                        clearInterval(interval);
                        spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        spinner.fail(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                        return reject(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        spinner.fail(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                        return reject(
                            "Can't connect to the running emulator. Try restarting it."
                        );
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const waitForWebpack = async (c, engine) => {
    logTask(`waitForWebpack|port:${c.runtime.port}|engine:${engine}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const extendConfig = getConfigProp(c, c.platform, 'webpackConfig', {});
    const devServerHost = getValidLocalhost(extendConfig.devServerHost, c.runtime.localhost);
    let url = `http://${devServerHost}:${c.runtime.port}/assets/bundle.js`;

    if (engine === 'next') url = `http://${devServerHost}:${c.runtime.port}`;

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
                        return reject(
                            "Can't connect to webpack. Try restarting it."
                        );
                    }
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
};
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
    initializeBuilder,
    logErrorPlatform,
    configureIfRequired,
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
    cleanPlatformIfRequired,
    checkPortInUse,
    waitForEmulator,
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
