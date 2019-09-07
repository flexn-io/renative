/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import detectPort from 'detect-port';
import ora from 'ora';
import ip from 'ip';
import axios from 'axios';
import inquirer from 'inquirer';

import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath,
    isRunningOnWindows
} from './systemTools/fileutils';
import { createPlatformBuild, cleanPlatformBuild } from './cli/platform';
import appRunner from './cli/app';
import { configureTizenGlobal } from './platformTools/tizen';
import { applyTemplate, checkIfTemplateInstalled } from './templateTools';
import { getMergedPlugin, configurePlugins } from './pluginTools';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from './systemTools/logger';
import {
    ANDROID,
    WEB,
    TIZEN,
    IOS,
    TVOS,
    WEBOS,
    PLATFORMS,
    SDK_PLATFORMS,
    SUPPORTED_PLATFORMS
} from './constants';
import { executeAsync, execCLI } from './systemTools/exec';
import {
    parseRenativeConfigs, createRnvConfig, updateConfig, gatherInfo,
    fixRenativeConfigsSync, configureRnvGlobal, checkIsRenativeProject
} from './configTools/configParser';
import { configureEntryPoints, configureNodeModules, checkAndCreateProjectPackage, cleanPlaformAssets } from './projectTools/projectParser';
import { generateOptions } from './systemTools/prompt';
import { checkAndMigrateProject } from './projectTools/migrator';

export const NO_OP_COMMANDS = ['fix', 'clean', 'tool', 'status', 'log', 'new', 'target', 'platform', 'crypto'];
export const PARSE_RENATIVE_CONFIG = ['crypto'];

export const initializeBuilder = (cmd, subCmd, process, program) => new Promise((resolve, reject) => {
    const c = createRnvConfig(program, process, cmd, subCmd);

    configureLogger(c, c.process, c.command, c.subCommand, program.info === true);
    logInitialize();

    resolve(c);
});

export const startBuilder = c => new Promise((resolve, reject) => {
    logTask('initializeBuilder');

    if (NO_OP_COMMANDS.includes(c.command)) {
        checkAndMigrateProject(c)
            .then(() => parseRenativeConfigs(c))
            .then(() => configureRnvGlobal(c))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    checkAndMigrateProject(c)
        .then(() => parseRenativeConfigs(c))
        .then(() => checkIsRenativeProject(c))
        .then(() => checkAndCreateProjectPackage(c))
        .then(() => configureRnvGlobal(c))
        .then(() => checkIfTemplateInstalled(c))
        .then(() => fixRenativeConfigsSync(c))
        .then(() => configureNodeModules(c))
        .then(() => applyTemplate(c))
        .then(() => configurePlugins(c))
        .then(() => configureNodeModules(c))
        .then(() => updateConfig(c, c.runtime.appId))
        .then(() => logAppInfo(c))
        .then(() => resolve(c))
        .catch(e => reject(e));
});

export const isPlatformSupportedSync = (platform, resolve, reject) => {
    if (!platform) {
        if (reject) {
            reject(
                chalk.red(
                    `You didn't specify platform. make sure you add "${chalk.white.bold(
                        '-p <PLATFORM>',
                    )}" option to your command!`,
                ),
            );
        }
        return false;
    }
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        if (reject) reject(chalk.red(`Platform ${platform} is not supported. Use one of the following: ${chalk.white(SUPPORTED_PLATFORMS.join(', '))} .`));
        return false;
    }
    if (resolve) resolve();
    return true;
};

export const isPlatformSupported = async (c) => {
    logTask(`isPlatformSupported:${c.platform}`);
    if (!c.platform || c.platform === '?') {
        let platformsAsObj = c.buildConfig ? c.buildConfig.platforms : c.supportedPlatforms;
        if (!platformsAsObj) platformsAsObj = SUPPORTED_PLATFORMS;
        const opts = generateOptions(platformsAsObj);

        const { platform } = await inquirer.prompt({
            name: 'platform',
            type: 'list',
            message: 'Pick one of available platforms',
            choices: opts.keysAsArray
        });

        c.platform = platform;
        c.program.platform = platform;
        return platform;
    }

    if (!SUPPORTED_PLATFORMS.includes(c.platform)) {
        return Promise.reject(chalk.red(`Platform ${c.platform} is not supported. Use one of the following: ${chalk.white(SUPPORTED_PLATFORMS.join(', '))}`));
    }
};

export const isBuildSchemeSupported = async (c) => {
    logTask(`isBuildSchemeSupported:${c.platform}`);

    const { scheme } = c.program;

    if (!c.buildConfig.platforms[c.platform]) {
        c.buildConfig.platforms[c.platform] = {};
    }

    const { buildSchemes } = c.buildConfig.platforms[c.platform];


    if (!buildSchemes) {
        logWarning(`Your appConfig for platform ${c.platform} has no buildSchemes. Will continue with defaults`);
        return;
    }

    const schemeDoesNotExist = scheme && !buildSchemes[scheme];
    if (scheme === '?' || schemeDoesNotExist) {
        if (schemeDoesNotExist && scheme && scheme !== '?') {
            logError('Build scheme you picked does not exists.');
        }
        const opts = generateOptions(buildSchemes);

        const { selectedScheme } = await inquirer.prompt({
            name: 'selectedScheme',
            type: 'list',
            message: 'Pick one of available buildSchemes',
            choices: opts.keysAsArray
        });

        c.program.scheme = selectedScheme;
        return selectedScheme;
    }
    return scheme;
};

export const spawnCommand = (c, overrideParams) => {
    const newCommand = {};

    Object.keys(c).forEach((k) => {
        if (typeof newCommand[k] === 'object' && !(newCommand[k] instanceof 'String')) {
            newCommand[k] = { ...c[k] };
        } else {
            newCommand[k] = c[k];
        }
    });

    const merge = require('deepmerge');

    Object.keys(overrideParams).forEach((k) => {
        if (newCommand[k] && typeof overrideParams[k] === 'object') {
            newCommand[k] = merge(newCommand[k], overrideParams[k], { arrayMerge: _arrayMergeOverride });
        } else {
            newCommand[k] = overrideParams[k];
        }
    });

    // This causes stack overflow on Linux
    // const merge = require('deepmerge');
    // const newCommand = merge(c, overrideParams, { arrayMerge: _arrayMergeOverride });
    return newCommand;
};

export const isSdkInstalled = (c, platform) => {
    logTask(`isSdkInstalled: ${platform}`);

    if (c.files.private.config) {
        const sdkPlatform = SDK_PLATFORMS[platform];
        if (sdkPlatform) return fs.existsSync(c.files.private.config.sdks[sdkPlatform]);
    }

    return false;
};

export const checkSdk = (c, platform, reject) => {
    if (!isSdkInstalled(c, platform)) {
        reject && reject(`${platform} requires SDK to be installed. check your ${chalk.white(c.paths.private.config)} file if you SDK path is correct. current value is ${chalk.white(c.files.private.config?.sdks?.ANDROID_SDK)}`);
        return false;
    }
    return true;
};

const _arrayMergeOverride = (destinationArray, sourceArray, mergeOptions) => sourceArray;

export const getAppFolder = (c, platform) => path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);

export const getAppSubFolder = (c, platform) => {
    let subFolder = '';
    if (platform === IOS) subFolder = 'RNVApp';
    else if (platform === TVOS) subFolder = 'RNVAppTVOS';
    return path.join(getAppFolder(c, platform), subFolder);
};

export const getAppTemplateFolder = (c, platform) => path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`);

export const getAppConfigId = (c, platform) => c.buildConfig.id;

const _getValueOrMergedObject = (resultCli, o1, o2, o3) => {
    if (resultCli) {
        return resultCli;
    }
    if (o1) {
        if (Array.isArray(o1) || typeof o1 !== 'object') return o1;
        const val = Object.assign(o3 || {}, o2 || {}, o1);
        return val;
    }
    if (o1 === null) return null;
    if (o2) {
        if (Array.isArray(o2) || typeof o2 !== 'object') return o2;
        return Object.assign(o3 || {}, o2);
    }
    if (o2 === null) return null;
    return o3;
};

export const CLI_PROPS = [
    'provisioningStyle',
    'codeSignIdentity',
    'provisionProfileSpecifier'
];

export const getConfigProp = (c, platform, key, defaultVal) => {
    if (!c.buildConfig) {
        logError('getConfigProp: c.buildConfig is undefined!');
        return null;
    }
    const p = c.buildConfig.platforms[platform];
    const ps = _getScheme(c);
    let resultPlatforms;
    let scheme;
    if (p) {
        scheme = p.buildSchemes ? p.buildSchemes[ps] : null;
        resultPlatforms = c.buildConfig.platforms[platform][key];
    }


    scheme = scheme || {};
    const resultCli = CLI_PROPS.includes(key) ? c.program[key] : null;
    const resultScheme = scheme[key];
    const resultCommon = c.buildConfig.common[key];

    const result = _getValueOrMergedObject(resultCli, resultScheme, resultPlatforms, resultCommon);

    logTask(`getConfigProp:${platform}:${key}:${result}`, chalk.grey);
    if (result === null || result === undefined) return defaultVal;
    return result;
};

export const getJsBundleFileDefaults = {
    android: 'super.getJSBundleFile()',
    androidtv: 'super.getJSBundleFile()',
    // CRAPPY BUT Android Wear does not support webview required for connecting to packager
    androidwear: '"assets://index.androidwear.bundle"',
};

export const getAppId = (c, platform) => {
    const id = getConfigProp(c, platform, 'id');
    const idSuffix = getConfigProp(c, platform, 'idSuffix');
    return idSuffix ? `${id}${idSuffix}` : id;
};

export const getAppTitle = (c, platform) => getConfigProp(c, platform, 'title');

export const getAppVersion = (c, platform) => c.buildConfig.platforms[platform].version || c.buildConfig.common.version || c.files.project.package.version;

export const getAppAuthor = (c, platform) => c.buildConfig.platforms[platform].author || c.buildConfig.common.author || c.files.project.package.author;

export const getAppLicense = (c, platform) => c.buildConfig.platforms[platform].license || c.buildConfig.common.license || c.files.project.package.license;

export const getEntryFile = (c, platform) => c.buildConfig.platforms[platform].entryFile;

export const getGetJsBundleFile = (c, platform) => c.buildConfig.platforms[platform].getJsBundleFile || getJsBundleFileDefaults[platform];

export const getAppDescription = (c, platform) => c.buildConfig.platforms[platform].description || c.buildConfig.common.description || c.files.project.package.description;

export const getAppVersionCode = (c, platform) => {
    if (c.buildConfig.platforms[platform].versionCode) {
        return c.buildConfig.platforms[platform].versionCode;
    }
    if (c.buildConfig.common.versionCode) {
        return c.buildConfig.common.versionCode;
    }
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

export const logErrorPlatform = (platform, resolve) => {
    logError(`Platform: ${chalk.white(platform)} doesn't support command: ${chalk.white(c.command)}`);
    resolve && resolve();
};

export const isPlatformActive = (c, platform, resolve) => {
    if (!c.buildConfig || !c.buildConfig.platforms) {
        logError(`Looks like your appConfigFile is not configured properly! check ${chalk.white(c.paths.appConfig.config)} location.`);
        if (resolve) resolve();
        return false;
    }
    if (!c.buildConfig.platforms[platform]) {
        console.log(`Platform ${platform} not configured for ${c.runtime.appId}. skipping.`);
        if (resolve) resolve();
        return false;
    }
    return true;
};

export const PLATFORM_RUNS = {};

export const configureIfRequired = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_configureIfRequired:${platform}`);

    if (PLATFORM_RUNS[platform]) {
        resolve();
        return;
    }
    PLATFORM_RUNS[platform] = true;
    const { device } = c.program;
    // if (!fs.existsSync(getAppFolder(c, platform))) {
    //    logWarning(`Looks like your app is not configured for ${platform}! Let's try to fix it!`);
    const nc = spawnCommand(c, {
        command: 'configure',
        program: {
            appConfig: c.id,
            update: false,
            platform,
            device
        }
    });

    if (c.program.reset) {
        cleanPlatformBuild(c, platform)
            .then(() => cleanPlaformAssets(c))
            .then(() => createPlatformBuild(c, platform))
            .then(() => appRunner(nc))
            .then(() => resolve(c))
            .catch(e => reject(e));
    } else {
        createPlatformBuild(c, platform)
            .then(() => appRunner(nc))
            .then(() => resolve(c))
            .catch(e => reject(e));
    }
});

export const writeCleanFile = (source, destination, overrides) => {
    // logTask(`writeCleanFile`)
    if (!fs.existsSync(source)) {
        logError(`Cannot write file. source path doesn't exists: ${source}`);
        return;
    }
    if (!fs.existsSync(destination)) {
        logWarning(`destination path doesn't exists: ${destination}. will create new one`);
        // return;
    }
    const pFile = fs.readFileSync(source, 'utf8');
    let pFileClean = pFile;
    overrides.forEach((v) => {
        const regEx = new RegExp(v.pattern, 'g');
        pFileClean = pFileClean.replace(regEx, v.override);
    });

    fs.writeFileSync(destination, pFileClean, 'utf8');
};

const _getScheme = c => c.program.scheme || 'debug';

export const getBuildsFolder = (c, platform, customPath) => {
    const pp = customPath || c.paths.appConfig.dir;
    // if (!fs.existsSync(pp)) {
    //     logWarning(`Path ${chalk.white(pp)} does not exist! creating one for you..`);
    // }
    const p = path.join(pp, `builds/${platform}@${_getScheme(c)}`);
    if (fs.existsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};

export const getIP = () => ip.address();

export const cleanPlatformIfRequired = (c, platform) => new Promise((resolve, reject) => {
    if (c.program.reset) {
        logInfo(`You passed ${chalk.white('-r')} argument. paltform ${chalk.white(platform)} will be cleaned up first!`);
        cleanPlatformBuild(c, platform)
            .then(() => resolve(c))
            .catch(e => reject(e));
    } else {
        resolve();
    }
});

export const checkPortInUse = (c, platform, port) => new Promise((resolve, reject) => {
    detectPort(port, (err, availablePort) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(port !== availablePort);
    });
});

export const resolveNodeModulePath = (c, filePath) => {
    let pth = path.join(c.paths.rnv.nodeModulesDir, filePath);
    if (!fs.existsSync(pth)) {
        pth = path.join(c.paths.project.nodeModulesDir, filePath);
    }
    return pth;
};

export const getBuildFilePath = (c, platform, filePath) => {
    // P1 => platformTemplates
    let sp = path.join(getAppTemplateFolder(c, platform), filePath);
    // P2 => projectConfigs + @buildSchemes
    const sp2 = path.join(getBuildsFolder(c, platform, c.paths.project.projectConfig.dir), filePath);
    if (fs.existsSync(sp2)) sp = sp2;
    // P3 => appConfigs + @buildSchemes
    const sp3 = path.join(getBuildsFolder(c, platform), filePath);
    if (fs.existsSync(sp3)) sp = sp3;
    return sp;
};

export const waitForEmulator = async (c, cli, command, callback) => {
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    const { maxErrorLength } = c.program;
    const spinner = ora('Waiting for emulator to boot...').start();

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            execCLI(c, cli, command, { silent: true, timeout: 10000, maxErrorLength })
                .then((resp) => {
                    if (callback(resp)) {
                        clearInterval(interval);
                        spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        spinner.fail('Can\'t connect to the running emulator. Try restarting it.');
                        return reject('Can\'t connect to the running emulator. Try restarting it.');
                    }
                }).catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        spinner.fail('Can\'t connect to the running emulator. Try restarting it.');
                        return reject('Can\'t connect to the running emulator. Try restarting it.');
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const waitForWebpack = (port) => {
    logTask(`waitForWebpack:${port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    const spinner = ora('Waiting for webpack to finish...').start();
    const localIp = isRunningOnWindows ? '127.0.0.1' : '0.0.0.0';

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            axios.get(`http://${localIp}:${port}`).then((res) => {
                if (res.status === 200) {
                    const isReady = res.data.toString().includes('<!DOCTYPE html>');
                    if (isReady) {
                        clearInterval(interval);
                        spinner.succeed();
                        return resolve(true);
                    }
                }
                attempts++;
                if (attempts === maxAttempts) {
                    clearInterval(interval);
                    spinner.fail('Can\'t connect to webpack. Try restarting it.');
                    return reject('Can\'t connect to webpack. Try restarting it.');
                }
            }).catch(() => {
                attempts++;
                if (attempts > maxAttempts) {
                    clearInterval(interval);
                    spinner.fail('Can\'t connect to webpack. Try restarting it.');
                    return reject('Can\'t connect to webpack. Try restarting it.');
                }
            });
        }, CHECK_INTEVAL);
    });
};

export const parseErrorMessage = (text, maxErrorLength = 800) => {
    const errors = [];
    const toSearch = /(exception|error|fatal|\[!])/i;

    const extractError = (t) => {
        const errorFound = t ? t.search(toSearch) : -1;
        if (errorFound === -1) return errors.length ? errors.join(' ') : false; // return the errors or false if we found nothing at all
        const usefulString = t.substring(errorFound); // dump first part of the string that doesn't contain what we look for
        let extractedError = usefulString.substring(0, maxErrorLength);
        if (extractedError.length === maxErrorLength) extractedError += '...'; // add elipsis if string is bigger than maxErrorLength
        errors.push(extractedError); // save the error
        const newString = usefulString.substring(100); // dump everything we processed and continue
        return extractError(newString);
    };

    return extractError(text);
};

// TODO: remove this
export {
    logInfo,
    logDebug,
    logError,
    logTask,
    logEnd,
    logWarning,
    logSuccess,
};

export default {
    getBuildFilePath,
    getBuildsFolder,
    configureEntryPoints,
    logWelcome,
    isPlatformSupported,
    isBuildSchemeSupported,
    isPlatformSupportedSync,
    getAppFolder,
    getAppTemplateFolder,
    logTask,
    logComplete,
    logError,
    initializeBuilder,
    startBuilder,
    logDebug,
    logInfo,
    logErrorPlatform,
    isPlatformActive,
    isSdkInstalled,
    checkSdk,
    logEnd,
    logWarning,
    configureIfRequired,
    getAppId,
    getAppTitle,
    getAppVersion,
    getAppVersionCode,
    writeCleanFile,
    getEntryFile,
    getGetJsBundleFile,
    getAppConfigId,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    logSuccess,
    getConfigProp,
    getIP,
    cleanPlatformIfRequired,
    checkPortInUse,
    resolveNodeModulePath,
    configureRnvGlobal,
    waitForEmulator,
    parseErrorMessage
};
