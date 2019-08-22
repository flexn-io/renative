import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import merge from 'deepmerge';
import {
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    KAIOS,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_NOVACOM,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
    ANDROID_SDK,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
    TIZEN_SDK,
    WEBOS_SDK,
    KAIOS_SDK,
    FIREFOX_OS,
    FIREFOX_TV,
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_PRIVATE_NAME,
    RENATIVE_CONFIG_LOCAL_NAME,
    RENATIVE_CONFIG_BUILD_NAME,
    RENATIVE_CONFIG_RUNTIME_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    PLATFORMS,
    SUPPORTED_PLATFORMS
} from '../constants';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath
} from '../systemTools/fileutils';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from '../systemTools/logger';
import { getQuestion } from '../systemTools/prompt';
import {
    copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateProjectConfig,
    checkAndCreateGitignore, copySharedPlatforms
} from '../projectTools/projectParser';


const base = path.resolve('.');
const homedir = require('os').homedir();

const IGNORE_FOLDERS = ['.git'];

export const createRnvConfig = (program, process, cmd, subCmd) => {
    const c = {
        cli: {},
        runtime: {

        },
        paths: {
            buildHooks: {
                dist: {}
            },
            home: {},
            rnv: {
                pluginTemplates: {},
                platformTemplates: {},
                plugins: {},
                projectTemplate: {}
            },
            global: {

            },
            project: {
                projectConfig: {},
                builds: {},
                assets: {},
                platformTemplates: {}
            },
            appConfig: {},
            private: {
                project: {
                    projectConfig: {},
                    builds: {},
                    assets: {},
                    platformTemplates: {}
                },
                appConfig: {}
            }
        },
        files: {
            rnv: {
                pluginTemplates: {},
                platformTemplates: {},
                plugins: {},
                projectTemplate: {}
            },
            global: {},
            project: {
                projectConfig: {},
                builds: {},
                assets: {},
                platformTemplates: {}
            },
            appConfig: {},
            private: {
                project: {
                    projectConfig: {},
                    builds: {},
                    assets: {},
                    platformTemplates: {}
                },
                appConfig: {}
            }
        }
    };

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    c.platformDefaults = PLATFORMS;

    c.paths.rnv.dir = path.join(__dirname, '../..');
    c.paths.rnv.nodeModulesDir = path.join(c.paths.rnv.dir, 'node_modules');
    c.paths.rnv.platformTemplates.dir = path.join(c.paths.rnv.dir, 'platformTemplates');
    c.paths.rnv.pluginTemplates.dir = path.join(c.paths.rnv.dir, 'pluginTemplates');
    c.paths.rnv.pluginTemplates.config = path.join(c.paths.rnv.pluginTemplates.dir, 'plugins.json');
    c.paths.rnv.package = path.join(c.paths.rnv.dir, 'package.json');
    c.paths.rnv.plugins.dir = path.join(c.paths.rnv.dir, 'plugins');
    c.paths.rnv.projectTemplate.dir = path.join(c.paths.rnv.dir, 'projectTemplate');
    c.files.rnv.package = JSON.parse(fs.readFileSync(c.paths.rnv.package).toString());

    c.platform = c.program.platform;
    c.runtime.platform = c.platform;
    c.paths.home.dir = homedir;
    c.paths.GLOBAL_RNV_DIR = path.join(c.paths.home.dir, '.rnv');
    c.paths.GLOBAL_RNV_CONFIG = path.join(c.paths.GLOBAL_RNV_DIR, RENATIVE_CONFIG_NAME);

    _generateConfigPaths(c.paths.project, base);

    c.paths.buildHooks.dir = path.join(c.paths.project.dir, 'buildHooks/src');
    c.paths.buildHooks.dist.dir = path.join(c.paths.project.dir, 'buildHooks/dist');
    c.paths.buildHooks.index = path.join(c.paths.buildHooks.dir, 'index.js');
    c.paths.buildHooks.dist.index = path.join(c.paths.buildHooks.dist.dir, 'index.js');
    c.paths.project.nodeModulesDir = path.join(c.paths.project.dir, 'node_modules');
    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.appConfigsDir = path.join(c.paths.project.dir, 'appConfigs');
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.rnCliConfig = path.join(c.paths.project.dir, RN_CLI_CONFIG_NAME);
    c.paths.project.babelConfig = path.join(c.paths.project.dir, RN_BABEL_CONFIG_NAME);
    c.paths.project.npmLinkPolyfill = path.join(c.paths.project.dir, 'npm_link_polyfill.json');
    c.paths.project.projectConfig.dir = path.join(c.paths.project.dir, 'projectConfig');
    c.paths.project.projectConfig.pluginsDir = path.join(c.paths.project.projectConfig.dir, 'plugins');
    c.paths.project.projectConfig.fontsDir = path.join(c.paths.project.projectConfig.dir, 'fonts');
    c.paths.project.assets.dir = path.join(c.paths.project.dir, 'platformAssets');
    c.paths.project.assets.config = path.join(c.paths.project.assets.dir, RENATIVE_CONFIG_RUNTIME_NAME);
    c.paths.project.builds.dir = path.join(c.paths.project.dir, 'platformBuilds');
    c.paths.project.builds.config = path.join(c.paths.project.builds.dir, RENATIVE_CONFIG_BUILD_NAME);

    _generateConfigPaths(c.paths.private, c.paths.GLOBAL_RNV_DIR);

    c.files.rnv.pluginTemplates.config = JSON.parse(fs.readFileSync(path.join(c.paths.rnv.pluginTemplates.config)).toString());

    return c;
};

export const parseRenativeConfigs = c => new Promise((resolve, reject) => {
    // LOAD ./platformBuilds/RENATIVE.BUILLD.JSON
    if (!loadFile(c.files.project.builds, c.paths.project.builds, 'config'));

    // LOAD ~/.rnv/RENATIVE.*.JSON
    _generateConfigPaths(c.paths.private, c.paths.GLOBAL_RNV_DIR);

    // LOAD ./RENATIVE.*.JSON
    _loadConfigFiles(c, c.files.project, c.paths.project);
    if (!c.files.project.config) return resolve();

    // LOAD ~/.rnv/[PROJECT_NAME]/RENATIVE.*.JSON
    _generateConfigPaths(c.paths.private, getRealPath(c, c.buildConfig.paths?.private?.dir) || c.paths.GLOBAL_RNV_DIR);
    _generateConfigPaths(c.paths.private.project, path.join(c.paths.GLOBAL_RNV_DIR, c.files.project.config.projectName));
    _loadConfigFiles(c, c.files.private.project, c.paths.private.project);


    c.paths.private.project.projectConfig.dir = path.join(c.paths.private.project.dir, 'projectConfig');
    c.paths.private.project.appConfigsDir = path.join(c.paths.private.project.dir, 'appConfigs');
    c.paths.project.appConfigsDir = getRealPath(c, c.buildConfig.paths?.appConfigsDir, 'appConfigsDir', c.paths.project.appConfigsDir);
    c.runtime.isWrapper = c.buildConfig.isWrapper;

    c.paths.project.platformTemplatesDirs = _generatePlatformTemplatePaths(c);

    resolve();
});

export const checkIsRenativeProject = c => new Promise((resolve, reject) => {
    if (!c.paths.project.configExists) {
        return reject(
            `Looks like this directory is not ReNative project. Project config ${chalk.white(
                c.paths.project.config,
            )} is missing!. You can create new project with ${chalk.white('rnv new')}`,
        );
    }

    return resolve();
});

export const fixRenativeConfigsSync = c => new Promise((resolve, reject) => {
    logTask('fixRenativeConfigsSync');

    // Parse Project Config
    // checkAndCreateProjectPackage(c, 'renative-app', 'ReNative App');

    // Check gitignore
    checkAndCreateGitignore(c);

    // Check rn-cli-config
    logTask('configureProject:check rn-cli', chalk.grey);
    if (!fs.existsSync(c.paths.project.rnCliConfig)) {
        logInfo(
            `Looks like your rn-cli config file ${chalk.white(c.paths.project.rnCliConfig)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnv.projectTemplate.dir, RN_CLI_CONFIG_NAME), c.paths.project.rnCliConfig);
    }

    // Check babel-config
    logTask('configureProject:check babel config', chalk.grey);
    if (!fs.existsSync(c.paths.project.babelConfig)) {
        logInfo(
            `Looks like your babel config file ${chalk.white(c.paths.project.babelConfig)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnv.dir, RN_BABEL_CONFIG_NAME), c.paths.project.babelConfig);
    }

    resolve();
});

const _generateConfigPaths = (pathObj, dir) => {
    pathObj.dir = dir;
    pathObj.config = path.join(dir, RENATIVE_CONFIG_NAME);
    pathObj.configLocal = path.join(dir, RENATIVE_CONFIG_LOCAL_NAME);
    pathObj.configPrivate = path.join(dir, RENATIVE_CONFIG_PRIVATE_NAME);
};

const _versionCheck = (c) => {
    logTask('_versionCheck');
    c.runtime.rnvVersionProject = c.files.rnv?.package?.version;
    c.runtime.rnvVersionRunner = c.files.project?.package?.devDependencies?.rnv;
    if (c.runtime.rnvVersionRunner && c.runtime.rnvVersionProject) {
        if (c.runtime.rnvVersionRunner !== c.runtime.rnvVersionProject) {
            const recCmd = chalk.white(`$ npx ${getCurrentCommand(true)}`);
            logWarning(`You are running $rnv v${chalk.red(c.runtime.rnvVersionRunner)} against project built with $rnv v${chalk.red(c.runtime.rnvVersionProject)}.
This might result in unexpected behaviour! It is recommended that you run your rnv command with npx prefix: ${recCmd} .`);
        }
    }
};

export const loadFile = (fileObj, pathObj, key) => {
    if (!fs.existsSync(pathObj[key])) {
        pathObj[`${key}Exists`] = false;
        logDebug(`WARNING: loadFile: Path ${pathObj[key]} does not exists!`);
        return false;
    }
    pathObj[`${key}Exists`] = true;
    try {
        fileObj[key] = JSON.parse(fs.readFileSync(pathObj[key]).toString());
        pathObj[`${key}Exists`] = true;
        return true;
    } catch (e) {
        logError(`loadFile: ${pathObj[key]} :: ${e}`);
        return false;
    }
};

const _loadConfigFiles = (c, fileObj, pathObj, extendDir) => {
    let result = false;
    let extendAppId;
    if (loadFile(fileObj, pathObj, 'config')) {
        extendAppId = fileObj.config.extend || extendAppId;
        result = true;
    }

    if (loadFile(fileObj, pathObj, 'configLocal')) {
        extendAppId = fileObj.configLocal.extend || extendAppId;
        result = true;
    }

    if (loadFile(fileObj, pathObj, 'configPrivate')) {
        extendAppId = fileObj.configPrivate.extend || extendAppId;
        result = true;
    }

    if (extendAppId && extendDir) {
        pathObj.configBase = path.join(extendDir, extendAppId, 'renative.json');
        pathObj.dirs = [
            path.join(extendDir, extendAppId),
            pathObj.dir
        ];
        loadFile(fileObj, pathObj, 'configBase');
    }

    _generateBuildConfig(c);
    return result;
};


export const setAppConfig = (c, appId) => {
    logTask(`setAppConfig:${appId}`);

    if (!appId) return;

    c.runtime.appId = appId;
    c.runtime.appDir = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.runtime.platform}`);

    _generateConfigPaths(c.paths.appConfig, path.join(c.paths.project.appConfigsDir, appId));
    _loadConfigFiles(c, c.files.appConfig, c.paths.appConfig, c.paths.project.appConfigsDir);

    _generateConfigPaths(c.paths.private.appConfig, path.join(c.paths.private.project.appConfigsDir, appId));
    _loadConfigFiles(c, c.files.private.appConfig, c.paths.private.appConfig, c.paths.private.project.appConfigsDir);

    _generateBuildConfig(c);
};

const _arrayMergeOverride = (destinationArray, sourceArray, mergeOptions) => sourceArray;

const _generateBuildConfig = (c) => {
    logTask('_generateBuildConfig');

    const mergeOrder = [
        c.paths.project.config,
        c.paths.project.configPrivate,
        c.paths.project.configLocal,
        c.paths.private.project.config,
        c.paths.private.project.configPrivate,
        c.paths.private.project.configLocal,
        c.paths.appConfig.configBase,
        c.paths.appConfig.config,
        c.paths.appConfig.configPrivate,
        c.paths.appConfig.configLocal,
        c.paths.private.appConfig.configBase,
        c.paths.private.appConfig.config,
        c.paths.private.appConfig.configPrivate,
        c.paths.private.appConfig.configLocal
    ];
    const cleanPaths = mergeOrder.filter(v => v);
    const existsPaths = cleanPaths.filter((v) => {
        const exists = fs.existsSync(v);
        if (exists) {
            console.log(`Merged: ${v}`);
            // console.log(chalk.green(v));
        } else {
            // console.log(chalk.red(v));
        }
        return exists;
    });

    const mergeFiles = [
        c.files.project.config,
        c.files.project.configPrivate,
        c.files.project.configLocal,
        c.files.private.project.config,
        c.files.private.project.configPrivate,
        c.files.private.project.configLocal,
        c.files.appConfig.configBase,
        c.files.appConfig.config,
        c.files.appConfig.configPrivate,
        c.files.appConfig.configLocal,
        c.files.private.appConfig.configBase,
        c.files.private.appConfig.config,
        c.files.private.appConfig.configPrivate,
        c.files.private.appConfig.configLocal
    ];

    // builds, fonts, plugins

    const mergeFolders = [
        // platform templates
        // c.paths.project.projectConfigs.builds.dir,
        // c.paths.project.projectConfigs.builds.dir,
        // c.paths.project.projectConfigs.builds.dir
    ];

    const meta = [{
        _meta: {
            generated: (new Date()).getTime(),
            mergedConfigs: existsPaths
        }
    }];

    const existsFiles = mergeFiles.filter((v, i) => v);

    logTask(`_generateBuildConfig:${mergeOrder.length}:${cleanPaths.length}:${existsPaths.length}:${existsFiles.length}`, chalk.grey);

    const out = merge.all([...meta, ...existsFiles], { arrayMerge: _arrayMergeOverride });
    c.buildConfig = out;
    if (fs.existsSync(c.paths.project.builds.dir)) {
        writeObjectSync(c.paths.project.builds.config, c.buildConfig);
    }

    c.assetConfig = {
        common: c.buildConfig.common
    };

    if (fs.existsSync(c.paths.project.assets.dir)) {
        writeObjectSync(c.paths.project.assets.config, c.assetConfig);
    }
};

const _generatePlatformTemplatePaths = (c) => {
    const pt = c.buildConfig.platformTemplatesFolders || {};
    const originalPath = c.buildConfig.platformTemplatesFolder || 'RNV_HOME/platformTemplates';
    const result = {};
    SUPPORTED_PLATFORMS.forEach((v) => {
        if (!pt[v]) {
            result[v] = getRealPath(
                c,
                originalPath,
                'platformTemplatesFolder',
                originalPath,
            );
        } else {
            result[v] = getRealPath(
                c,
                pt[v],
                'platformTemplatesFolder',
                originalPath,
            );
        }
    });
    return result;
};

export const updateConfig = (c, appConfigId) => new Promise((resolve, reject) => {
    logTask(`updateConfig:${appConfigId}`);

    setAppConfig(c, appConfigId);

    if (!fs.existsSync(c.paths.appConfig.dir)) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const configDirs = listAppConfigsFoldersSync(c);


        if (appConfigId !== '?') {
            logWarning(
                `It seems you don't have appConfig named ${chalk.white(appConfigId)} present in your config folder: ${chalk.white(
                    c.paths.project.appConfigsDir,
                )} !`,
            );
        }

        if (configDirs.length) {
            let opts = '';
            configDirs.forEach((v, i) => {
                opts += `(${chalk.white(i)}) ${chalk.white(v)}\n`;
            });

            readline.question(
                getQuestion(`ReNative found existing appConfigs. which one would you like to pick (pick number)?:\n${opts}`),
                (v) => {
                    if (configDirs[v]) {
                        c.defaultAppConfigId = configDirs[v];
                        setAppConfig(c, c.defaultAppConfigId);
                        resolve();
                    } else {
                        reject('Wrong option!');
                    }
                },
            );
        } else {
            readline.question(
                getQuestion(
                    `Do you want ReNative to create new sample appConfig (${chalk.white(
                        appConfigId,
                    )}) for you? (y) to confirm`,
                ),
                (v) => {
                    c.defaultAppConfigId = SAMPLE_APP_ID;
                    setAppConfig(c, c.defaultAppConfigId);
                    copyFolderContentsRecursiveSync(
                        path.join(c.paths.rnv.dir, 'appConfigs', c.defaultAppConfigId),
                        path.join(c.paths.appConfig.dir),
                    );
                    resolve();
                },
            );
        }
    } else {
        resolve();
    }
});

export const listAppConfigsFoldersSync = (c) => {
    const configDirs = [];
    fs.readdirSync(c.paths.project.appConfigsDir).forEach((dir) => {
        if (!IGNORE_FOLDERS.includes(dir) && fs.lstatSync(path.join(c.paths.project.appConfigsDir, dir)).isDirectory()) {
            configDirs.push(dir);
        }
    });
    return configDirs;
};

export const gatherInfo = c => new Promise((resolve, reject) => {
    logTask('gatherInfo');
    try {
        if (fs.existsSync(c.paths.project.package)) {
            c.files.project.package = JSON.parse(fs.readFileSync(c.paths.project.package).toString());
        } else {
            console.log('Missing appConfigPath', c.paths.project.package);
        }
        if (fs.existsSync(c.paths.project.builds.config)) {
            c.buildConfig = JSON.parse(fs.readFileSync(c.paths.project.builds.config).toString());
            c.runtime.appId = c.buildConfig.id;
        } else {
            console.log('Missing runtimeConfigPath', c.paths.project.builds.config);
        }
        if (fs.existsSync(c.paths.project.config)) {
            c.files.project.config = JSON.parse(fs.readFileSync(c.paths.project.config).toString());
        } else {
            console.log('Missing projectConfigPath', c.paths.project.config);
        }
    } catch (e) {
        reject(e);
    }

    resolve();
});

export const configureRnvGlobal = c => new Promise((resolve, reject) => {
    logTask('configureRnvGlobal');
    // Check globalConfigFolder
    if (fs.existsSync(c.paths.GLOBAL_RNV_DIR)) {
        console.log(`${c.paths.GLOBAL_RNV_DIR} folder exists!`);
    } else {
        console.log(`${c.paths.GLOBAL_RNV_DIR} folder missing! Creating one for you...`);
        mkdirSync(c.paths.GLOBAL_RNV_DIR);
    }

    // Check globalConfig
    if (fs.existsSync(c.paths.GLOBAL_RNV_CONFIG)) {
        console.log(`${c.paths.GLOBAL_RNV_DIR}/${RENATIVE_CONFIG_NAME} file exists!`);
    } else {
        const oldGlobalConfigPath = path.join(c.paths.GLOBAL_RNV_DIR, 'config.json');
        if (fs.existsSync(oldGlobalConfigPath)) {
            logWarning('Found old version of your config. will copy it to new renative.json config');
            copyFileSync(oldGlobalConfigPath, c.paths.GLOBAL_RNV_CONFIG);
        } else {
            console.log(`${c.paths.GLOBAL_RNV_DIR}/${RENATIVE_CONFIG_NAME} file missing! Creating one for you...`);
            copyFileSync(path.join(c.paths.rnv.dir, 'supportFiles', 'global-config-template.json'), c.paths.GLOBAL_RNV_CONFIG);
            console.log(
                `Don\'t forget to Edit: ${
                    c.paths.GLOBAL_RNV_DIR
                }/${RENATIVE_CONFIG_NAME} with correct paths to your SDKs before continuing!`,
            );
        }
    }

    if (fs.existsSync(c.paths.GLOBAL_RNV_CONFIG)) {
        c.files.GLOBAL_RNV_CONFIG = JSON.parse(fs.readFileSync(c.paths.GLOBAL_RNV_CONFIG).toString());

        if (c.files.GLOBAL_RNV_CONFIG.appConfigsPath) {
            if (!fs.existsSync(c.files.GLOBAL_RNV_CONFIG.appConfigsPath)) {
                logWarning(
                    `Looks like your custom global appConfig is pointing to ${chalk.white(
                        c.files.GLOBAL_RNV_CONFIG.appConfigsPath,
                    )} which doesn't exist! Make sure you create one in that location`,
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk.white(
                        c.files.GLOBAL_RNV_CONFIG.appConfigsPath,
                    )}. ReNativewill now swith to that location!`,
                );
                c.paths.project.appConfigsDir = c.files.GLOBAL_RNV_CONFIG.appConfigsPath;
            }
        }

        const isRunningOnWindows = process.platform === 'win32';

        // Check global SDKs
        const { sdks } = c.files.GLOBAL_RNV_CONFIG;
        if (sdks) {
            if (sdks.ANDROID_SDK) {
                c.cli[CLI_ANDROID_EMULATOR] = path.join(sdks.ANDROID_SDK, `emulator/emulator${isRunningOnWindows ? '.exe' : ''}`);
                c.cli[CLI_ANDROID_ADB] = path.join(sdks.ANDROID_SDK, `platform-tools/adb${isRunningOnWindows ? '.exe' : ''}`);
                c.cli[CLI_ANDROID_AVDMANAGER] = path.join(sdks.ANDROID_SDK, `tools/bin/avdmanager${isRunningOnWindows ? '.bat' : ''}`);
                c.cli[CLI_ANDROID_SDKMANAGER] = path.join(sdks.ANDROID_SDK, `tools/bin/sdkmanager${isRunningOnWindows ? '.bat' : ''}`);
            }
            if (sdks.TIZEN_SDK) {
                c.cli[CLI_TIZEN_EMULATOR] = path.join(sdks.TIZEN_SDK, `tools/emulator/bin/em-cli${isRunningOnWindows ? '.bat' : ''}`);
                c.cli[CLI_TIZEN] = path.join(sdks.TIZEN_SDK, `tools/ide/bin/tizen${isRunningOnWindows ? '.bat' : ''}`);
                c.cli[CLI_SDB_TIZEN] = path.join(sdks.TIZEN_SDK, 'tools/sdb');
            }
            if (sdks.WEBOS_SDK) {
                c.cli[CLI_WEBOS_ARES] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares-package${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_INSTALL] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares-install${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_LAUNCH] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares-launch${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares-setup-device${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares-device-info${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_NOVACOM] = path.join(c.files.GLOBAL_RNV_CONFIG.sdks.WEBOS_SDK, `CLI/bin/ares-novacom${isRunningOnWindows ? '.cmd' : ''}`);
            }
        } else {
            logWarning(`Your ${c.paths.GLOBAL_RNV_CONFIG} is missing SDK configuration object`);
        }


        // Check config sanity
        if (c.files.GLOBAL_RNV_CONFIG.defaultTargets === undefined) {
            logWarning(
                `Looks like you\'re missing defaultTargets in your config ${chalk.white(c.paths.GLOBAL_RNV_CONFIG)}. Let's add them!`,
            );
            const defaultConfig = JSON.parse(
                fs.readFileSync(path.join(c.paths.rnv.dir, 'supportFiles', 'global-config-template.json')).toString(),
            );
            const newConfig = { ...c.files.GLOBAL_RNV_CONFIG, defaultTargets: defaultConfig.defaultTargets };
            fs.writeFileSync(c.paths.GLOBAL_RNV_CONFIG, JSON.stringify(newConfig, null, 2));
        }
    }

    resolve();
});
