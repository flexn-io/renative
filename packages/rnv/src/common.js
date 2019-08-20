/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import detectPort from 'detect-port';
import { exec } from 'child_process';

import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath
} from './systemTools/fileutils';
import { createPlatformBuild, cleanPlatformBuild } from './cli/platform';
import appRunner from './cli/app';
import { configureTizenGlobal } from './platformTools/tizen';
import { applyTemplate, checkIfTemplateInstalled } from './templateTools';
import { getMergedPlugin, parsePlugins } from './pluginTools';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from './systemTools/logger';
import {
    ANDROID,
    WEB,
    TIZEN,
    TVOS,
    WEBOS,
    PLATFORMS,
    SDK_PLATFORMS,
    SUPPORTED_PLATFORMS
} from './constants';
import { executeAsync } from './systemTools/exec';
import {
    parseRenativeConfigsSync, createRnvConfig, updateConfig, gatherInfo,
    fixRenativeConfigsSync, configureRnvGlobal
} from './configTools/configParser';
import { configureEntryPoints } from './configTools/projectParser';
import { askQuestion, generateOptions, finishQuestion } from './systemTools/prompt';

const NO_OP_COMMANDS = ['fix', 'clean', 'tool', 'status', 'crypto'];


const isPlatformSupportedSync = (platform, resolve, reject) => {
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
        if (reject) reject(chalk.red(`Platform ${platform} is not supported`));
        return false;
    }
    if (resolve) resolve();
    return true;
};

const isPlatformSupported = c => new Promise((resolve, reject) => {
    logTask(`isPlatformSupported:${c.platform}`);
    if (!c.platform || c.platform === '?') {
        let platformsAsObj = c.buildConfig ? c.buildConfig.platforms : c.supportedPlatforms;
        if (!platformsAsObj) platformsAsObj = SUPPORTED_PLATFORMS;
        const opts = generateOptions(platformsAsObj);

        askQuestion(`Pick one of available platforms (number or text):\n${opts.asString}`).then((v) => {
            finishQuestion();

            opts.pick(v)
                .then((selectedPlatform) => {
                    c.platform = selectedPlatform;
                    c.program.platform = selectedPlatform;
                    resolve(selectedPlatform);
                })
                .catch(e => reject(e));
        });
    } else if (!SUPPORTED_PLATFORMS.includes(c.platform)) {
        reject(chalk.red(`Platform ${c.platform} is not supported`));
    } else {
        resolve();
    }
});

const isBuildSchemeSupported = c => new Promise((resolve, reject) => {
    logTask(`isBuildSchemeSupported:${c.platform}`);

    const { scheme } = c.program;

    if (!c.buildConfig.platforms[c.platform]) {
        c.buildConfig.platforms[c.platform] = {};
    }

    const { buildSchemes } = c.buildConfig.platforms[c.platform];


    if (!buildSchemes) {
        logWarning(`Your appConfig for platform ${c.platform} has no buildSchemes. Will continue with defaults`);
        resolve();
        return;
    }

    const schemeDoesNotExist = scheme && !buildSchemes[scheme];
    if (scheme === '?' || schemeDoesNotExist) {
        if (schemeDoesNotExist && scheme && scheme !== '?') {
            logError('Build scheme you picked does not exists.');
        }
        const opts = generateOptions(buildSchemes);

        askQuestion(`Pick one of available buildSchemes (number or text):\n${opts.asString}`).then((v) => {
            finishQuestion();
            opts.pick(v)
                .then((selectedScheme) => {
                    c.program.scheme = selectedScheme;
                    resolve(selectedScheme);
                }).catch(e => reject(e));
        });
    } else {
        resolve(scheme);
    }
});

const initializeBuilder = (cmd, subCmd, process, program) => new Promise((resolve, reject) => {
    const c = createRnvConfig(program, process, cmd, subCmd);

    configureLogger(c, c.process, c.command, c.subCommand, program.info === true);
    logInitialize();

    resolve(c);
});

const startBuilder = c => new Promise((resolve, reject) => {
    logTask('initializeBuilder');

    c.files.pluginTemplatesConfig = JSON.parse(fs.readFileSync(path.join(c.paths.rnv.pluginTemplates.config)).toString());

    if ((c.command === 'app' && c.subCommand === 'create') || c.command === 'new') {
        resolve(c);
        return;
    }

    parseRenativeConfigsSync(c);

    if (c.command === 'target' || c.command === 'log' || c.subCommand === 'fixPackage') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    if (!c.paths.project.configExists) {
        reject(
            `Looks like this directory is not ReNative project. Project config ${chalk.white(
                c.paths.project.config,
            )} is missing!. You can create new project with ${chalk.white('rnv new')}`,
        );
    }

    if (c.command === 'platform') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    if (NO_OP_COMMANDS.includes(c.command)) {
        gatherInfo(c)
            .then(() => resolve(c))
            .catch(e => reject(c));
        return;
    }

    configureRnvGlobal(c)
        .then(() => checkIfTemplateInstalled(c))
        .then(() => fixRenativeConfigsSync(c))
        .then(() => configureNodeModules(c))
        .then(() => applyTemplate(c))
        .then(() => configurePlugins(c))
        .then(() => configureNodeModules(c))
        .then(() => configureApp(c))
        .then(() => logAppInfo(c))
        .then(() => resolve(c))
        .catch(e => reject(e));
});

const configureNodeModules = c => new Promise((resolve, reject) => {
    logTask('configureNodeModules');
    // Check node_modules
    if (!fs.existsSync(c.paths.project.nodeModulesDir) || c._requiresNpmInstall) {
        if (!fs.existsSync(c.paths.project.nodeModulesDir)) {
            logWarning(
                `Looks like your node_modules folder ${chalk.white(c.paths.project.nodeModulesDir)} is missing! Let's run ${chalk.white(
                    'npm install',
                )} first!`,
            );
        } else {
            logWarning(`Looks like your node_modules out of date! Let's run ${chalk.white('npm install')} first!`);
        }
        _npmInstall(c).then(() => resolve()).catch(e => reject(e));
    } else {
        resolve();
    }
});

const _npmInstall = (c, failOnError = false) => new Promise((resolve, reject) => {
    logTask('_npmInstall');
    executeAsync('npm', ['install'])
        .then(() => {
            resolve();
        })
        .catch((e) => {
            if (failOnError) {
                logError(e);
                resolve();
            } else {
                logWarning(`${e}\n Seems like your node_modules is corrupted by other libs. ReNative will try to fix it for you`);
                cleanNodeModules(c)
                    .then(() => _npmInstall(c, true))
                    .then(() => resolve())
                    .catch((e) => {
                        logError(e);
                        resolve();
                    });
            }
        });
});

const cleanNodeModules = c => new Promise((resolve, reject) => {
    logTask(`cleanNodeModules:${c.paths.project.nodeModulesDir}`);
    removeDirs([
        path.join(c.paths.project.nodeModulesDir, 'react-native-safe-area-view/.git'),
        path.join(c.paths.project.nodeModulesDir, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.project.nodeModulesDir, 'react-navigation/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.rnv.nodeModulesDir, 'react-native-safe-area-view/.git'),
        path.join(c.paths.rnv.nodeModulesDir, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.rnv.nodeModulesDir, 'react-navigation/node_modules/react-native-safe-area-view/.git')
    ]).then(() => resolve()).catch(e => reject(e));
});

const configurePlugins = c => new Promise((resolve, reject) => {
    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;
    for (const k in c.buildConfig.plugins) {
        const dependencies = c.files.project.package.dependencies;
        const devDependencies = c.files.project.package.devDependencies;
        const plugin = getMergedPlugin(c, k, c.buildConfig.plugins);

        if (!plugin) {
            logWarning(`Plugin with name ${
                chalk.white(k)} does not exists in ReNative source:rnv scope. you need to define it manually here: ${
                chalk.white(c.paths.project.builds.config)}`);
        } else if (dependencies && dependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && dependencies[k] !== plugin.version) {
                if (k === 'renative' && c.runtime.isWrapper) {
                    logWarning('You\'re in ReNative wrapper mode. plugin renative will stay as local dep!');
                } else {
                    logWarning(
                        `Version mismatch of dependency ${chalk.white(k)} between:
  ${chalk.white(c.paths.project.package)}: v(${chalk.red(dependencies[k])}) and
  ${chalk.white(c.paths.project.builds.config)}: v(${chalk.green(plugin.version)}).
  package.json will be overriden`
                    );
                    hasPackageChanged = true;
                    dependencies[k] = plugin.version;
                }
            }
        } else if (devDependencies && devDependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && devDependencies[k] !== plugin.version) {
                logWarning(
                    `Version mismatch of devDependency ${chalk.white(k)} between package.json: v(${chalk.red(
                        devDependencies[k],
                    )}) and plugins.json: v(${chalk.red(plugin.version)}). package.json will be overriden`,
                );
                hasPackageChanged = true;
                devDependencies[k] = plugin.version;
            }
        } else if (plugin['no-active'] !== true && plugin['no-npm'] !== true) {
            // Dependency does not exists
            logWarning(
                `Missing dependency ${chalk.white(k)} v(${chalk.red(
                    plugin.version,
                )}) in package.json. package.json will be overriden`,
            );

            hasPackageChanged = true;
            dependencies[k] = plugin.version;
        }

        if (plugin && plugin.npm) {
            for (const npmKey in plugin.npm) {
                const npmDep = plugin.npm[npmKey];
                if (dependencies[npmKey] !== npmDep) {
                    logWarning(`Plugin ${chalk.white(k)} requires npm dependency ${chalk.white(npmKey)} .Adding missing npm dependency to you package.json`);
                    dependencies[npmKey] = npmDep;
                    hasPackageChanged = true;
                }
            }
        }
    }
    if (hasPackageChanged) {
        writeObjectSync(c.paths.project.package, c.files.project.package);
        c._requiresNpmInstall = true;
    }

    resolve();
});

const configureApp = c => new Promise((resolve, reject) => {
    logTask(`configureApp:${c.runtime.appId}`);

    if (c.runtime.appId) {
        // App ID specified
        updateConfig(c, c.runtime.appId)
            .then(() => {
                configureEntryPoints(c);
                resolve(c);
            })
            .catch(e => reject(e));
    } else {
        // Use latest app from platformAssets
        if (!fs.existsSync(c.paths.project.builds.config)) {
            logWarning(
                `Seems like you're missing ${
                    c.paths.project.builds.config
                } file. But don't worry. ReNative got you covered. Let's configure it for you!`,
            );

            updateConfig(c, c.defaultAppConfigId)
                .then(() => {
                    configureEntryPoints(c);
                    appRunner(spawnCommand(c, {
                        command: 'configure',
                        program: {
                            appConfig: c.defaultAppConfigId,
                            update: true,
                        }
                    }))
                        .then(() => resolve(c))
                        .catch(e => reject(e));
                })
                .catch(e => reject(e));
        } else {
            try {
                const assetConfig = JSON.parse(fs.readFileSync(c.paths.project.builds.config).toString());
                updateConfig(c, assetConfig.id)
                    .then(() => {
                        configureEntryPoints(c);
                        resolve(c);
                    })
                    .catch(e => reject(e));
            } catch (e) {
                reject(e);
            }
        }
    }
});

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

const isSdkInstalled = (c, platform) => {
    logTask(`isSdkInstalled: ${platform}`);

    if (c.files.globalConfig) {
        const sdkPlatform = SDK_PLATFORMS[platform];
        if (sdkPlatform) return fs.existsSync(c.files.globalConfig.sdks[sdkPlatform]);
    }

    return false;
};

const checkSdk = (c, platform, reject) => {
    if (!isSdkInstalled(c, platform)) {
        reject && reject(`${platform} requires SDK to be installed. check your ${c.paths.private.config} file if you SDK path is correct`);
        return false;
    }
    return true;
};

const _arrayMergeOverride = (destinationArray, sourceArray, mergeOptions) => sourceArray;

const getAppFolder = (c, platform) => path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${platform}`);

const getAppTemplateFolder = (c, platform) => path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`);

const getAppConfigId = (c, platform) => c.buildConfig.id;

const _getValueOrMergedObject = (resultCli, o1, o2, o3) => {
    if (resultCli) {
        return resultCli;
    }
    if (o1) {
        if (Array.isArray(o1) || typeof o1 !== 'object') return o1;
        const val = Object.assign(o3 || {}, o2 || {}, o1);
        return val;
    }
    if (o2) {
        if (Array.isArray(o2) || typeof o2 !== 'object') return o2;
        return Object.assign(o3 || {}, o2);
    }
    return o3;
};

const CLI_PROPS = [
    'provisioningStyle',
    'codeSignIdentity',
    'provisionProfileSpecifier'
];

const getConfigProp = (c, platform, key, defaultVal) => {
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

const getJsBundleFileDefaults = {
    android: 'super.getJSBundleFile()',
    androidtv: 'super.getJSBundleFile()',
    // CRAPPY BUT Android Wear does not support webview required for connecting to packager
    androidwear: '"assets://index.androidwear.bundle"',
};

const getAppId = (c, platform) => getConfigProp(c, platform, 'id');

const getAppTitle = (c, platform) => getConfigProp(c, platform, 'title');

const getAppVersion = (c, platform) => c.buildConfig.platforms[platform].version || c.buildConfig.common.verion || c.files.project.package.version;

const getAppAuthor = (c, platform) => c.buildConfig.platforms[platform].author || c.buildConfig.common.author || c.files.project.package.author;

const getAppLicense = (c, platform) => c.buildConfig.platforms[platform].license || c.buildConfig.common.license || c.files.project.package.license;

const getEntryFile = (c, platform) => c.buildConfig.platforms[platform].entryFile;

const getGetJsBundleFile = (c, platform) => c.buildConfig.platforms[platform].getJsBundleFile || getJsBundleFileDefaults[platform];

const getAppDescription = (c, platform) => c.buildConfig.platforms[platform].description || c.buildConfig.common.description || c.files.project.package.description;

const getAppVersionCode = (c, platform) => {
    if (c.buildConfig.platforms[platform].versionCode) {
        return c.buildConfig.platforms[platform].versionCode;
    }
    if (c.buildConfig.common.verionCode) {
        return c.buildConfig.common.verionCode;
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

const logErrorPlatform = (platform, resolve) => {
    logError(`Platform: ${chalk.white(platform)} doesn't support command: ${chalk.white(c.command)}`);
    resolve && resolve();
};

const isPlatformActive = (c, platform, resolve) => {
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

const PLATFORM_RUNS = {};

const configureIfRequired = (c, platform) => new Promise((resolve, reject) => {
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

const writeCleanFile = (source, destination, overrides) => {
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

const copyBuildsFolder = (c, platform) => new Promise((resolve, reject) => {
    logTask(`copyBuildsFolder:${platform}`);
    if (!isPlatformActive(c, platform, resolve)) return;

    const destPath = path.join(getAppFolder(c, platform));

    // FOLDER MERGERS PROJECT CONFIG
    const sourcePath1 = getBuildsFolder(c, platform, c.paths.project.projectConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath1, destPath);

    // FOLDER MERGERS PROJECT CONFIG (PRIVATE)
    const sourcePath1sec = getBuildsFolder(c, platform, c.paths.private.project.projectConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath1sec, destPath);

    // FOLDER MERGERS FROM APP CONFIG
    const sourcePath0 = getBuildsFolder(c, platform, c.paths.appConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath0, destPath, c.paths.appConfig.dir);

    // FOLDER MERGERS FROM APP CONFIG (PRIVATE)
    const sourcePath0sec = getBuildsFolder(c, platform, c.paths.private.appConfig.dir);
    copyFolderContentsRecursiveSync(sourcePath0sec, destPath);

    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getBuildsFolder(c, platform, path.join(c.paths.project.projectConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3, destPath);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getBuildsFolder(c, platform, path.join(c.paths.private.project.projectConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath);

        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getBuildsFolder(c, platform, path.join(c.paths.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2, destPath);

        // FOLDER MERGES FROM APP CONFIG PLUGIN (PRIVATE)
        const sourcePath2sec = getBuildsFolder(c, platform, path.join(c.paths.private.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2sec, destPath);
    });

    resolve();
});

const _getScheme = c => c.program.scheme || 'debug';

const getBuildsFolder = (c, platform, customPath) => {
    const pp = customPath || c.paths.appConfig.dir;
    // if (!fs.existsSync(pp)) {
    //     logWarning(`Path ${chalk.white(pp)} does not exist! creating one for you..`);
    // }
    const p = path.join(pp, `builds/${platform}@${_getScheme(c)}`);
    if (fs.existsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};

const getIP = () => {
    const ip = require('ip');
    return ip.address();
};

const cleanPlatformIfRequired = (c, platform) => new Promise((resolve, reject) => {
    if (c.program.reset) {
        logInfo(`You passed ${chalk.white('-r')} argument. paltform ${chalk.white(platform)} will be cleaned up first!`);
        cleanPlatformBuild(c, platform)
            .then(() => resolve(c))
            .catch(e => reject(e));
    } else {
        resolve();
    }
});

const checkPortInUse = (c, platform, port) => new Promise((resolve, reject) => {
    detectPort(port, (err, availablePort) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(port !== availablePort);
    });
});

const resolveNodeModulePath = (c, filePath) => {
    let pth = path.join(c.paths.rnv.nodeModulesDir, filePath);
    if (!fs.existsSync(pth)) {
        pth = path.join(c.paths.project.nodeModulesDir, filePath);
    }
    return pth;
};

const getBuildFilePath = (c, platform, filePath) => {
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

export {
    getBuildFilePath,
    configureEntryPoints,
    getBuildsFolder,
    generateOptions,
    logWelcome,
    isPlatformSupported,
    cleanNodeModules,
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
    copyBuildsFolder,
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
    finishQuestion,
    askQuestion,
    resolveNodeModulePath,
    configureRnvGlobal
};

export default {
    getBuildFilePath,
    getBuildsFolder,
    configureEntryPoints,
    generateOptions,
    logWelcome,
    copyBuildsFolder,
    cleanNodeModules,
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
    finishQuestion,
    askQuestion,
    resolveNodeModulePath,
    configureRnvGlobal
};
