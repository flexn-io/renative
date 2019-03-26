import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync, copyFileSync, mkdirSync } from './fileutils';
import { createPlatformBuild } from './cli/platform';
import appRunner, { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore } from './cli/app';
import { configureTizenGlobal } from './platformTools/tizen';
import {
    IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS, TIZEN_WATCH, KAIOS,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES, CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
    FORM_FACTOR_MOBILE, FORM_FACTOR_DESKTOP, FORM_FACTOR_WATCH, FORM_FACTOR_TV,
    ANDROID_SDK, ANDROID_NDK, TIZEN_SDK, WEBOS_SDK, KAIOS_SDK,
    RNV_PROJECT_CONFIG_NAME, RNV_GLOBAL_CONFIG_NAME, RNV_APP_CONFIG_NAME, RN_CLI_CONFIG_NAME, SAMPLE_APP_ID,
} from './constants';
import { executeAsync } from './exec';

const SUPPORTED_PLATFORMS = [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS, TIZEN_WATCH, KAIOS];
const SUPPORTED_PLATFORMS_MAC = [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS, TIZEN_WATCH];
const SUPPORTED_PLATFORMS_WIN = [ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, WINDOWS, TIZEN_WATCH];
const SUPPORTED_PLATFORMS_LINUX = [];
const RNV_START = '🚀 RNV';
const RNV = 'RNV';
const LINE = chalk.white.bold('----------------------------------------------------------');

let _currentJob;
let _currentProcess;
let _isInfoEnabled = false;

const base = path.resolve('.');
const homedir = require('os').homedir();

const SDK_PLATFORMS = {};
SDK_PLATFORMS[ANDROID] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_TV] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_WEAR] = ANDROID_SDK;
SDK_PLATFORMS[TIZEN] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_WATCH] = TIZEN_SDK;
SDK_PLATFORMS[WEBOS] = WEBOS_SDK;
SDK_PLATFORMS[KAIOS] = KAIOS_SDK;


const isPlatformSupported = (platform, resolve, reject) => {
    if (!platform) {
        if (reject) reject(chalk.red(`You didn't specify platform. make sure you add "${chalk.white.bold('-p <PLATFORM>')}" option to your command!`));
        return false;
    }
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        if (reject) reject(chalk.red(`Platform ${platform} is not supported`));
        return false;
    }
    if (resolve) resolve();
    return true;
};

const _getPath = (c, p, key = 'undefined', original) => {
    if (!p) {
        logWarning(`Path ${chalk.white(key)} is not defined`);
        return original;
    }
    if (p.startsWith('./')) {
        return path.join(c.projectRootFolder, p);
    }
    return p.replace(/RNV_HOME/g, c.rnvHomeFolder).replace(/~/g, c.homeFolder);
};

const initializeBuilder = (cmd, subCmd, process, program) => new Promise((resolve, reject) => {
    _currentJob = cmd;
    _currentProcess = process;
    console.log(chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(`${cmd} ${subCmd || ''}`)} is firing up! 🔥\n${LINE}\n`));

    logTask('initializeBuilder');


    _isInfoEnabled = program.info === true;
    const c = { cli: {} };

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    c.appID = program.appConfigID;
    c.rnvRootFolder = path.join(__dirname, '../..');
    c.rnvHomeFolder = path.join(__dirname, '..');
    c.rnvPlatformTemplatesFolder = path.join(c.rnvHomeFolder, 'platformTemplates');
    c.rnvPackagePath = path.join(c.rnvRootFolder, 'package.json');
    c.rnvPluginsFolder = path.join(c.rnvHomeFolder, 'plugins');
    c.rnvPackage = JSON.parse(fs.readFileSync(c.rnvPackagePath).toString());

    if (c.command === 'app' && c.subCommand === 'create') {
        resolve(c);
        return;
    }

    c.platform = program.platform;
    c.projectRootFolder = base;
    c.projectSourceFolder = path.join(c.projectRootFolder, 'src');
    c.projectNpmLinkPolyfillPath = path.join(c.projectRootFolder, 'npm_link_polyfill.json');
    c.homeFolder = homedir;
    c.globalConfigFolder = path.join(homedir, '.rnv');
    c.globalConfigPath = path.join(c.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
    c.projectConfigPath = path.join(c.projectRootFolder, RNV_PROJECT_CONFIG_NAME);
    c.projectPackagePath = path.join(c.projectRootFolder, 'package.json');
    c.projectPluginsFolder = path.join(c.projectRootFolder, 'plugins');
    c.rnCliConfigPath = path.join(c.projectRootFolder, RN_CLI_CONFIG_NAME);
    c.projectConfigFolder = path.join(c.projectRootFolder, 'projectConfig');


    if (_currentJob === 'target') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    if (!fs.existsSync(c.projectConfigPath)) {
        reject(`Looks like this directory is not RNV project. Project config ${chalk.white(c.projectConfigPath)} is missing!. You can create new project with ${chalk.white('rnv app create')}`);
    }
    c.projectConfig = JSON.parse(fs.readFileSync(c.projectConfigPath).toString());
    c.globalConfigFolder = _getPath(c, c.projectConfig.globalConfigFolder, 'globalConfigFolder', c.globalConfigFolder);
    c.globalConfigPath = path.join(c.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
    c.appConfigsFolder = _getPath(c, c.projectConfig.appConfigsFolder, 'appConfigsFolder', c.appConfigsFolder);
    c.entryFolder = _getPath(c, c.projectConfig.entryFolder, 'entryFolder', c.entryFolder);
    c.platformTemplatesFolder = _getPath(c, c.projectConfig.platformTemplatesFolder, 'platformTemplatesFolder', c.platformTemplatesFolder);
    c.platformAssetsFolder = _getPath(c, c.projectConfig.platformAssetsFolder, 'platformAssetsFolder', c.platformAssetsFolder);
    c.platformBuildsFolder = _getPath(c, c.projectConfig.platformBuildsFolder, 'platformBuildsFolder', c.platformBuildsFolder);
    c.projectPluginsFolder = _getPath(c, c.projectConfig.projectPlugins, 'projectPlugins', c.projectPluginsFolder);
    c.nodeModulesFolder = path.join(c.projectRootFolder, 'node_modules');
    c.runtimeConfigPath = path.join(c.platformAssetsFolder, RNV_APP_CONFIG_NAME);
    c.projectConfigFolder = _getPath(c, c.projectConfig.projectConfigFolder, 'projectConfigFolder', c.projectConfigFolder);
    c.pluginConfigPath = path.join(c.projectConfigFolder, 'plugins.json');
    c.permissionsConfigPath = path.join(c.projectConfigFolder, 'permissions.json');
    c.fontsConfigPath = path.join(c.projectConfigFolder, 'fonts.json');
    c.fontsConfigFolder = path.join(c.projectConfigFolder, 'fonts');

    if (_currentJob === 'platform') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    configureRnvGlobal(c)
        .then(() => configureProject(c))
        .then(() => configureNodeModules(c))
        .then(() => configureTizenGlobal(c))
        // .then(() => configureAndroidGlobal(c))
        .then(() => configureApp(c))
        .then(() => resolve(c))
        .catch(e => reject(e));
});

const configureProject = c => new Promise((resolve, reject) => {
    logTask('configureProject');


    // Parse Project Config
    checkAndCreateProjectPackage(c, 'rn-vanilla', 'RN Vanilla');
    c.projectPackage = JSON.parse(fs.readFileSync(c.projectPackagePath).toString());
    c.defaultAppConfigId = c.projectPackage.defaultAppConfigId || SAMPLE_APP_ID;

    // Check gitignore
    checkAndCreateGitignore(c);

    // Check rn-cli-config
    logTask('configureProject:check rn-cli');
    if (!fs.existsSync(c.rnCliConfigPath)) {
        logWarning(`Looks like your rn-cli config file ${chalk.white(c.rnCliConfigPath)} is missing! Let's create one for you.`);
        copyFileSync(path.join(c.rnvRootFolder, RN_CLI_CONFIG_NAME), c.rnCliConfigPath);
    }

    // Check entry
    logTask('configureProject:check entry');
    if (!fs.existsSync(c.entryFolder)) {
        logWarning(`Looks like your entry folder ${chalk.white(c.entryFolder)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(c.rnvRootFolder, 'entry'), c.entryFolder);
    }

    // Check src
    logTask('configureProject:check src');
    if (!fs.existsSync(c.projectSourceFolder)) {
        logWarning(`Looks like your src folder ${chalk.white(c.projectSourceFolder)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(c.rnvRootFolder, 'src'), c.projectSourceFolder);
    }

    // Check appConfigs
    logTask('configureProject:check appConfigs');
    c.appConfigFolder = path.join(c.appConfigsFolder, c.defaultAppConfigId);
    if (!fs.existsSync(c.appConfigsFolder)) {
        logWarning(`Looks like your appConfig folder ${chalk.white(c.appConfigsFolder)} is missing! Let's create sample helloWorld config for you.`);
        copyFolderContentsRecursiveSync(path.join(c.rnvRootFolder, 'appConfigs', SAMPLE_APP_ID), c.appConfigFolder);
        // Update App Title to match package.json
        try {
            c.appConfigPath = path.join(c.appConfigFolder, RNV_APP_CONFIG_NAME);

            const appConfig = JSON.parse(fs.readFileSync(c.appConfigPath).toString());

            appConfig.common.title = c.projectPackage.title;
            appConfig.common.id = c.projectPackage.defaultAppId;
            appConfig.id = c.defaultAppConfigId;

            fs.writeFileSync(c.appConfigPath, JSON.stringify(appConfig, null, 2));
        } catch (e) {
            logError(e);
        }
    }

    // Check projectConfigs
    logTask('configureProject:check projectConfigs');
    if (!fs.existsSync(c.projectConfigFolder)) {
        logWarning(`Looks like your projectConfig folder ${chalk.white(c.projectConfigFolder)} is missing! Let's create one for you.`);
        copyFolderContentsRecursiveSync(path.join(c.rnvRootFolder, 'projectConfig'), c.projectConfigFolder);
    }

    // Check plugins
    logTask('configureProject:check plugins');
    if (fs.existsSync(c.pluginConfigPath)) {
        c.pluginConfig = JSON.parse(fs.readFileSync(c.pluginConfigPath).toString());
    } else {
        logWarning(`Looks like your plugin config is missing from ${chalk.white(c.pluginConfigPath)}. let's create one for you!`);
        c.pluginConfig = { plugins: {} };
        fs.writeFileSync(c.pluginConfigPath, JSON.stringify(c.pluginConfig, null, 2));
    }

    if (!c.projectPackage.dependencies) {
        c.projectPackage.dependencies = {};
    }

    let hasPackageChanged = false;
    for (const k in c.pluginConfig.plugins) {
        const dependencies = c.projectPackage.dependencies;
        const plugin = c.pluginConfig.plugins[k];
        if (dependencies[k]) {
            if (dependencies[k] !== plugin.version) {
                logWarning(`Version mismatch of dependency ${chalk.white(k)} between package.json: v(${chalk.red(dependencies[k])}) and plugins.json: v(${chalk.red(plugin.version)}). package.json will be overriden`);
                hasPackageChanged = true;
                dependencies[k] = plugin.version;
            }
        } else {
            // Dependency does not exists
            logWarning(`Missing dependency ${chalk.white(k)} v(${chalk.red(plugin.version)}) in package.json. package.json will be overriden`);

            hasPackageChanged = true;
            dependencies[k] = plugin.version;
        }
    }
    if (hasPackageChanged) {
        fs.writeFileSync(c.projectPackagePath, JSON.stringify(c.projectPackage, null, 2));
        c._requiresNpmInstall = true;
    }


    // Check permissions
    logTask('configureProject:check permissions');
    if (fs.existsSync(c.permissionsConfigPath)) {
        c.permissionsConfig = JSON.parse(fs.readFileSync(c.permissionsConfigPath).toString());
    } else {
        const newPath = path.join(c.rnvRootFolder, 'appConfigs/permissions.json');
        logWarning(`Looks like your permission config is missing from ${chalk.white(c.permissionsConfigPath)}. RNV Default ${chalk.white(newPath)} will be used instead`);
        c.permissionsConfigPath = newPath;
        c.permissionsConfig = JSON.parse(fs.readFileSync(c.permissionsConfigPath).toString());
    }

    resolve();
});

const configureNodeModules = c => new Promise((resolve, reject) => {
    logTask('configureNodeModules');
    // Check node_modules
    if (!fs.existsSync(c.nodeModulesFolder) || c._requiresNpmInstall) {
        // reject(`Looks like your node_modules folder ${chalk.white(c.nodeModulesFolder)} is missing! Run ${chalk.white('npm install')} first!`);

        if (!fs.existsSync(c.nodeModulesFolder)) {
            logWarning(`Looks like your node_modules folder ${chalk.white(c.nodeModulesFolder)} is missing! Let's run ${chalk.white('npm install')} first!`);
        } else {
            logWarning(`Looks like your node_modules out of date! Let's run ${chalk.white('npm install')} first!`);
        }
        executeAsync('npm', ['install']).then(() => {
            resolve();
        }).catch(error => logError(error));
    } else {
        resolve();
    }
});

const configureRnvGlobal = c => new Promise((resolve, reject) => {
    logTask('configureRnvGlobal');
    // Check globalConfigFolder
    if (fs.existsSync(c.globalConfigFolder)) {
        console.log('.rnv folder exists!');
    } else {
        console.log('.rnv folder missing! Creating one for you...');
        mkdirSync(c.globalConfigFolder);
    }

    // Check globalConfig
    if (fs.existsSync(c.globalConfigPath)) {
        console.log(`.rnv/${RNV_GLOBAL_CONFIG_NAME} file exists!`);
    } else {
        console.log(`.rnv/${RNV_GLOBAL_CONFIG_NAME} file missing! Creating one for you...`);
        copyFileSync(path.join(c.rnvHomeFolder, 'supportFiles', RNV_GLOBAL_CONFIG_NAME), c.globalConfigPath);
        console.log(`Don\'t forget to Edit: .rnv/${RNV_GLOBAL_CONFIG_NAME} with correct paths to your SDKs before continuing!`);
    }

    if (fs.existsSync(c.globalConfigPath)) {
        c.globalConfig = JSON.parse(fs.readFileSync(c.globalConfigPath).toString());

        if (c.globalConfig.appConfigsPath) {
            if (!fs.existsSync(c.globalConfig.appConfigsPath)) {
                logWarning(`Looks like your custom global appConfig is pointing to ${chalk.white(c.globalConfig.appConfigsPath)} which doesn't exist! Make sure you create one in that location`);
            } else {
                logInfo(`Found custom appConfing location pointing to ${chalk.white(c.globalConfig.appConfigsPath)}. RNV will now swith to that location!`);
                c.appConfigsFolder = c.globalConfig.appConfigsPath;
            }
        }

        // Check global SDKs
        c.cli[CLI_ANDROID_EMULATOR] = path.join(c.globalConfig.sdks.ANDROID_SDK, 'tools/emulator');
        c.cli[CLI_ANDROID_ADB] = path.join(c.globalConfig.sdks.ANDROID_SDK, 'platform-tools/adb');
        c.cli[CLI_TIZEN_EMULATOR] = path.join(c.globalConfig.sdks.TIZEN_SDK, 'tools/emulator/bin/em-cli');
        c.cli[CLI_TIZEN] = path.join(c.globalConfig.sdks.TIZEN_SDK, 'tools/ide/bin/tizen');
        c.cli[CLI_WEBOS_ARES] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares');
        c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-package');
        c.cli[CLI_WEBBOS_ARES_INSTALL] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-install');
        c.cli[CLI_WEBBOS_ARES_LAUNCH] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-launch');

        // Check config sanity
        if (c.globalConfig.defaultTargets === undefined) {
            logWarning(`Looks like you\'re missing defaultTargets in your config ${chalk.white(c.globalConfigPath)}. Let's add them!`);
            const defaultConfig = JSON.parse(fs.readFileSync(path.join(c.rnvHomeFolder, 'supportFiles', RNV_GLOBAL_CONFIG_NAME)).toString());
            const newConfig = { ...c.globalConfig, defaultTargets: defaultConfig.defaultTargets };
            fs.writeFileSync(c.globalConfigPath, JSON.stringify(newConfig, null, 2));
        }
    }

    resolve();
});


const configureApp = c => new Promise((resolve, reject) => {
    logTask('configureApp');

    if (c.appID) {
        // App ID specified
        _getConfig(c, c.appID);
        resolve(c);
    } else {
        // Use latest app from platformAssets
        if (!fs.existsSync(c.runtimeConfigPath)) {
            logWarning(`Seems like you\'re missing ${c.runtimeConfigPath} file. But don\'t worry. RNV got you covered. Let\'s configure it for you!`);

            _getConfig(c, c.defaultAppConfigId);

            const newCommand = Object.assign({}, c);
            newCommand.subCommand = 'configure';
            newCommand.program = { appConfig: c.defaultAppConfigId, update: true, platform: c.program.platform };
            appRunner(newCommand).then(() => resolve(c)).catch(e => reject(e));
        } else {
            try {
                const assetConfig = JSON.parse(fs.readFileSync(c.runtimeConfigPath).toString());
                _getConfig(c, assetConfig.id);
                resolve(c);
            } catch (e) {
                reject(e);
            }
        }
    }
});

const isSdkInstalled = (c, platform) => {
    logTask(`isSdkInstalled: ${platform}`);

    if (c.globalConfig) {
        const sdkPlatform = SDK_PLATFORMS[platform];
        if (sdkPlatform) return fs.existsSync(c.globalConfig.sdks[sdkPlatform]);
    }

    return false;
};

const checkSdk = (c, platform, reject) => {
    if (!isSdkInstalled(c, platform)) {
        reject(`${platform} requires SDK to be installed. check your ~/.rnv/config.json file if you SDK path is correct`);
        return false;
    }
    return true;
};


const logTask = (task) => {
    console.log(chalk.green(`\n${RNV} ${_currentJob} - ${task} - Starting!`));
};

const logWarning = (msg) => {
    console.log(chalk.yellow(`\n${RNV} ${_currentJob} - WARNING: ${msg}`));
};

const logInfo = (msg) => {
    console.log(chalk.magenta(`\n${RNV} ${_currentJob} - NOTE: ${msg}`));
};

const logDebug = (...args) => {
    if (_isInfoEnabled) console.log.apply(null, args);
};

const logComplete = (isEnd = false) => {
    console.log(chalk.white.bold(`\n ${RNV} ${_currentJob} - Done! 🚀`));
    if (isEnd) logEnd();
};

const logSuccess = (msg) => {
    console.log(`\n ✅ ${chalk.magenta(msg)}`);
};

const getQuestion = msg => chalk.blue(`\n ❓ ${msg}: `);

const logError = (e, isEnd = false) => {
    console.log(chalk.red.bold(`\n${RNV} ${_currentJob} - ERRROR! ${e}`));
    if (isEnd) logEnd();
};

const logEnd = () => {
    console.log(chalk.bold(`\n${LINE}\n`));
    _currentProcess.exit();
};

const _getConfig = (c, appConfigId) => {
    logTask(`_getConfig:${appConfigId}`);

    c.appConfigFolder = path.join(c.appConfigsFolder, appConfigId);
    c.appConfigPath = path.join(c.appConfigFolder, RNV_APP_CONFIG_NAME);
    c.appConfigFile = JSON.parse(fs.readFileSync(c.appConfigPath).toString());
    c.appId = appConfigId;
};

const getAppFolder = (c, platform) => path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);

const getAppTemplateFolder = (c, platform) => path.join(c.platformTemplatesFolder, `${platform}`);

const getAppConfigId = (c, platform) => c.appConfigFile.id;

const getAppId = (c, platform) => c.appConfigFile.platforms[platform].id || c.appConfigFile.common.id;

const getAppTitle = (c, platform) => c.appConfigFile.platforms[platform].title || c.appConfigFile.common.title;

const getAppVersion = (c, platform) => c.appConfigFile.platforms[platform].version || c.appConfigFile.common.verion || c.projectPackage.version;

const getAppAuthor = (c, platform) => c.appConfigFile.platforms[platform].author || c.appConfigFile.common.author || c.projectPackage.author;

const getAppLicense = (c, platform) => c.appConfigFile.platforms[platform].license || c.appConfigFile.common.license || c.projectPackage.license;

const getEntryFile = (c, platform) => c.appConfigFile.platforms[platform].entryFile;

const getAppDescription = (c, platform) => c.appConfigFile.platforms[platform].description || c.appConfigFile.common.description || c.projectPackage.description;

const getAppVersionCode = (c, platform) => {
    if (c.appConfigFile.platforms[platform].versionCode) {
        return c.appConfigFile.platforms[platform].versionCode;
    } if (c.appConfigFile.common.verionCode) {
        return c.appConfigFile.common.verionCode;
    }
    const version = getAppVersion(c, platform);

    let vc = '';
    version.split('-')[0].split('.').forEach((v) => {
        vc += v.length > 1 ? v : `0${v}`;
    });
    return Number(vc).toString();
};

const logErrorPlatform = (platform, resolve) => {
    console.log(`ERROR: Platform: ${chalk.bold(platform)} doesn't support command: ${chalk.bold(_currentJob)}`);
    resolve();
};

const isPlatformActive = (c, platform, resolve) => {
    if (!c.appConfigFile || !c.appConfigFile.platforms) {
        logError(`Looks like your appConfigFile is not configured properly! check ${chalk.white(c.appConfigPath)} location.`);
        if (resolve) resolve();
        return false;
    }
    if (!c.appConfigFile.platforms[platform]) {
        console.log(`Platform ${platform} not configured for ${c.appId}. skipping.`);
        if (resolve) resolve();
        return false;
    }
    return true;
};

const configureIfRequired = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_configureIfRequired:${platform}`);

    // if (!fs.existsSync(getAppFolder(c, platform))) {
    //    logWarning(`Looks like your app is not configured for ${platform}! Let's try to fix it!`);

    const newCommand = Object.assign({}, c);
    newCommand.subCommand = 'configure';
    newCommand.program = { appConfig: c.id, update: false, platform };

    createPlatformBuild(c, platform)
        .then(() => appRunner(newCommand))
        .then(() => resolve(c))
        .catch(e => reject(e));
    // } else {
    //     copyRuntimeAssets(c).then(() => resolve()).catch(e => reject(e));
    // }
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
    const pFile = fs.readFileSync(source).toString();
    let pFileClean = pFile;
    overrides.forEach((v) => {
        const regEx = new RegExp(v.pattern, 'g');
        pFileClean = pFileClean.replace(regEx, v.override);
    });


    fs.writeFileSync(destination, pFileClean);
};


export {
    SUPPORTED_PLATFORMS, isPlatformSupported, getAppFolder, getAppTemplateFolder,
    logTask, logComplete, logError, initializeBuilder, logDebug, logInfo, logErrorPlatform,
    isPlatformActive, isSdkInstalled, checkSdk, logEnd, logWarning, configureIfRequired,
    getAppId, getAppTitle, getAppVersion, getAppVersionCode, writeCleanFile,
    getEntryFile, getAppConfigId, getAppDescription, getAppAuthor, getAppLicense, getQuestion, logSuccess,
    IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS, TIZEN_WATCH,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES, CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
    FORM_FACTOR_MOBILE, FORM_FACTOR_DESKTOP, FORM_FACTOR_WATCH, FORM_FACTOR_TV,
};

export default {
    SUPPORTED_PLATFORMS,
    isPlatformSupported,
    getAppFolder,
    getAppTemplateFolder,
    logTask,
    logComplete,
    logError,
    initializeBuilder,
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
    getAppConfigId,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    getQuestion,
    logSuccess,
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
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
};
