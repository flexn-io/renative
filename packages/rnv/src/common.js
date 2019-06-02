import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import detectPort from 'detect-port';
import { cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, removeDirs } from './fileutils';
import { createPlatformBuild, cleanPlatformBuild } from './cli/platform';
import appRunner, { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore } from './cli/app';
import { configureTizenGlobal } from './platformTools/tizen';
import { applyTemplate, checkIfTemplateInstalled } from './templateTools';
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
    KAIOS,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
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
    ANDROID_SDK,
    ANDROID_NDK,
    TIZEN_SDK,
    WEBOS_SDK,
    KAIOS_SDK,
    FIREFOX_OS,
    FIREFOX_TV,
    RNV_PROJECT_CONFIG_NAME,
    RNV_GLOBAL_CONFIG_NAME,
    RNV_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    PLATFORMS
} from './constants';
import { executeAsync } from './exec';

const SUPPORTED_PLATFORMS = [
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
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
];
const SUPPORTED_PLATFORMS_MAC = [
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
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
];
const SUPPORTED_PLATFORMS_WIN = [
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TVOS,
    WEBOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
];

const SUPPORTED_PLATFORMS_LINUX = [ANDROID, ANDROID_TV, ANDROID_WEAR];
const RNV_START = '🚀 ReNative';
const RNV = 'ReNative';
const LINE = chalk.white.bold('----------------------------------------------------------');
const LINE2 = chalk.gray('----------------------------------------------------------');

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

const logWelcome = () => {
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────────┐
|                                                                                 |
|         ${chalk.red('██████╗')} ███████╗${chalk.red('███╗   ██╗')} █████╗ ████████╗██╗${chalk.red('██╗   ██╗')}███████╗         |
|         ${chalk.red('██╔══██╗')}██╔════╝${chalk.red('████╗  ██║')}██╔══██╗╚══██╔══╝██║${chalk.red('██║   ██║')}██╔════╝         |
|         ${chalk.red('██████╔╝')}█████╗  ${chalk.red('██╔██╗ ██║')}███████║   ██║   ██║${chalk.red('██║   ██║')}█████╗           |
|         ${chalk.red('██╔══██╗')}██╔══╝  ${chalk.red('██║╚██╗██║')}██╔══██║   ██║   ██║${chalk.red('╚██╗ ██╔╝')}██╔══╝           |
|         ${chalk.red('██║  ██║')}███████╗${chalk.red('██║ ╚████║')}██║  ██║   ██║   ██║${chalk.red(' ╚████╔╝ ')}███████╗         |
|         ${chalk.red('╚═╝  ╚═╝')}╚══════╝${chalk.red('╚═╝  ╚═══╝')}╚═╝  ╚═╝   ╚═╝   ╚═╝${chalk.red('  ╚═══╝  ')}╚══════╝         |
|             🚀🚀🚀 https://www.npmjs.com/package/renative 🚀🚀🚀                |
└─────────────────────────────────────────────────────────────────────────────────┘
    `);
};

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
        const platformsAsObj = c.files.appConfigFile ? c.files.appConfigFile.platforms : c.supportedPlatforms;
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

    const scheme = c.program.scheme;
    const buildSchemes = c.files.appConfigFile.platforms[c.platform].buildSchemes;

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

const _getPath = (c, p, key = 'undefined', original) => {
    if (!p) {
        logWarning(`Path ${chalk.white(key)} is not defined`);
        return original;
    }
    if (p.startsWith('./')) {
        return path.join(c.paths.projectRootFolder, p);
    }
    return p.replace(/RNV_HOME/g, c.paths.rnvHomeFolder)
        .replace(/~/g, c.paths.homeFolder)
        .replace(/USER_HOME/g, c.paths.homeFolder)
        .replace(/PROJECT_HOME/g, c.paths.projectRootFolder);
};

const initializeBuilder = (cmd, subCmd, process, program) => new Promise((resolve, reject) => {
    _currentJob = cmd;
    _currentProcess = process;
    console.log(
        chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(`${cmd} ${subCmd || ''}`)} is firing up! 🔥\n${LINE}\n`),
    );

    logTask('initializeBuilder');

    _isInfoEnabled = program.info === true;
    const c = { cli: {}, paths: {}, files: {} };

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    c.platformDefaults = PLATFORMS;
    c.appID = program.appConfigID;
    c.paths.rnvRootFolder = path.join(__dirname, '..');
    c.paths.rnvHomeFolder = path.join(__dirname, '..');
    c.paths.rnvPlatformTemplatesFolder = path.join(c.paths.rnvHomeFolder, 'platformTemplates');
    c.paths.rnvPluginTemplatesFolder = path.join(c.paths.rnvHomeFolder, 'pluginTemplates');
    c.paths.rnvPluginTemplatesConfigPath = path.join(c.paths.rnvPluginTemplatesFolder, 'plugins.json');
    c.paths.rnvPackagePath = path.join(c.paths.rnvRootFolder, 'package.json');
    c.paths.rnvPluginsFolder = path.join(c.paths.rnvHomeFolder, 'plugins');
    c.paths.rnvProjectTemplateFolder = path.join(c.paths.rnvRootFolder, 'projectTemplate');
    c.files.rnvPackage = JSON.parse(fs.readFileSync(c.paths.rnvPackagePath).toString());
    c.files.pluginTemplatesConfig = JSON.parse(fs.readFileSync(path.join(c.paths.rnvPluginTemplatesConfigPath)).toString());
    c.supportedPlatforms = {};
    // TODO USE OS Specific Platforms
    SUPPORTED_PLATFORMS.forEach((v) => {
        c.supportedPlatforms[v] = true;
    });

    if ((c.command === 'app' && c.subCommand === 'create') || c.command === 'new') {
        resolve(c);
        return;
    }

    c.platform = program.platform;
    c.paths.projectRootFolder = base;
    c.paths.buildHooksFolder = path.join(c.paths.projectRootFolder, 'buildHooks/src');
    c.paths.buildHooksDistFolder = path.join(c.paths.projectRootFolder, 'buildHooks/dist');
    c.paths.buildHooksIndexPath = path.join(c.paths.buildHooksFolder, 'index.js');
    c.paths.buildHooksDistIndexPath = path.join(c.paths.buildHooksDistFolder, 'index.js');
    c.paths.projectSourceFolder = path.join(c.paths.projectRootFolder, 'src');
    c.paths.projectNpmLinkPolyfillPath = path.join(c.paths.projectRootFolder, 'npm_link_polyfill.json');
    c.paths.homeFolder = homedir;
    c.paths.globalConfigFolder = path.join(homedir, '.rnv');
    c.paths.globalConfigPath = path.join(c.paths.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
    c.paths.projectConfigPath = path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_NAME);
    c.paths.projectConfigLocalPath = path.join(c.paths.projectRootFolder, RNV_PROJECT_CONFIG_LOCAL_NAME);
    c.paths.projectPackagePath = path.join(c.paths.projectRootFolder, 'package.json');
    c.paths.rnCliConfigPath = path.join(c.paths.projectRootFolder, RN_CLI_CONFIG_NAME);
    c.paths.babelConfigPath = path.join(c.paths.projectRootFolder, RN_BABEL_CONFIG_NAME);
    c.paths.projectConfigFolder = path.join(c.paths.projectRootFolder, 'projectConfig');
    c.paths.projectPluginsFolder = path.join(c.paths.projectConfigFolder, 'plugins');

    try {
        c.files.projectPackage = JSON.parse(fs.readFileSync(c.paths.projectPackagePath).toString());
    } catch (e) {
        // IGNORE
    }

    const hasProjectConfigInCurrentDir = fs.existsSync(c.paths.projectConfigPath);

    if (hasProjectConfigInCurrentDir) {
        c.files.projectConfig = JSON.parse(fs.readFileSync(c.paths.projectConfigPath).toString());
        if (c.files.projectConfig.defaultPorts) {
            for (const pk in c.files.projectConfig.defaultPorts) {
                c.platformDefaults[pk].defaultPort = c.files.projectConfig.defaultPorts[pk];
            }
        }
        c.defaultProjectConfigs = c.files.projectConfig.defaultProjectConfigs || {};
        c.paths.globalConfigFolder = _getPath(c, c.files.projectConfig.globalConfigFolder, 'globalConfigFolder', c.paths.globalConfigFolder);
        c.paths.globalConfigPath = path.join(c.paths.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
        c.paths.appConfigsFolder = _getPath(c, c.files.projectConfig.appConfigsFolder, 'appConfigsFolder', c.paths.appConfigsFolder);
        c.paths.platformTemplatesFolder = _getPath(
            c,
            c.files.projectConfig.platformTemplatesFolder,
            'platformTemplatesFolder',
            c.paths.platformTemplatesFolder,
        );
        c.paths.platformAssetsFolder = _getPath(
            c,
            c.files.projectConfig.platformAssetsFolder,
            'platformAssetsFolder',
            c.paths.platformAssetsFolder,
        );
        c.paths.platformBuildsFolder = _getPath(
            c,
            c.files.projectConfig.platformBuildsFolder,
            'platformBuildsFolder',
            c.paths.platformBuildsFolder,
        );
        c.paths.projectPluginsFolder = _getPath(c, c.files.projectConfig.projectPlugins, 'projectPlugins', c.paths.projectPluginsFolder);
        c.paths.projectNodeModulesFolder = path.join(c.paths.projectRootFolder, 'node_modules');
        c.paths.rnvNodeModulesFolder = path.join(c.paths.rnvRootFolder, 'node_modules');
        c.paths.runtimeConfigPath = path.join(c.paths.platformAssetsFolder, RNV_APP_CONFIG_NAME);
        c.paths.projectConfigFolder = _getPath(
            c,
            c.files.projectConfig.projectConfigFolder,
            'projectConfigFolder',
            c.paths.projectConfigFolder,
        );
        c.paths.pluginConfigPath = path.join(c.paths.projectConfigFolder, 'plugins.json');
        c.paths.permissionsConfigPath = path.join(c.paths.projectConfigFolder, 'permissions.json');
        c.paths.fontsConfigFolder = path.join(c.paths.projectConfigFolder, 'fonts');
    }

    if (_currentJob === 'target' || _currentJob === 'log') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    if (!hasProjectConfigInCurrentDir) {
        reject(
            `Looks like this directory is not ReNativeproject. Project config ${chalk.white(
                c.paths.projectConfigPath,
            )} is missing!. You can create new project with ${chalk.white('rnv new')}`,
        );
    }

    if (_currentJob === 'platform') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    configureRnvGlobal(c)
        .then(() => checkIfTemplateInstalled(c))
        .then(() => configureProject(c))
        .then(() => configureNodeModules(c))
        .then(() => applyTemplate(c))
    // .then(() => configureTizenGlobal(c))
    // .then(() => configureAndroidGlobal(c))
        .then(() => configureApp(c))
        .then(() => logAppInfo(c))
        .then(() => resolve(c))
        .catch(e => reject(e));
});

const logAppInfo = c => new Promise((resolve, reject) => {
    console.log(chalk.gray(`\n${LINE2}\nℹ️  Current App Config: ${chalk.white.bold(c.files.appConfigFile.id)}\n${LINE2}`));

    resolve();
});

const configureProject = c => new Promise((resolve, reject) => {
    logTask('configureProject');

    // Parse Project Config
    checkAndCreateProjectPackage(c, 'renative-app', 'ReNative App');
    c.files.projectPackage = JSON.parse(fs.readFileSync(c.paths.projectPackagePath).toString());

    // Check gitignore
    checkAndCreateGitignore(c);

    // Check rn-cli-config
    logTask('configureProject:check rn-cli');
    if (!fs.existsSync(c.paths.rnCliConfigPath)) {
        logWarning(
            `Looks like your rn-cli config file ${chalk.white(c.paths.rnCliConfigPath)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnvRootFolder, 'supportFiles', RN_CLI_CONFIG_NAME), c.paths.rnCliConfigPath);
    }

    // Check babel-config
    logTask('configureProject:check babel config');
    if (!fs.existsSync(c.paths.babelConfigPath)) {
        logWarning(
            `Looks like your babel config file ${chalk.white(c.paths.babelConfigPath)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnvRootFolder, RN_BABEL_CONFIG_NAME), c.paths.babelConfigPath);
    }

    // Check entry
    // TODO: RN bundle command fails if entry files are not at root
    // logTask('configureProject:check entry');
    // if (!fs.existsSync(c.paths.entryFolder)) {
    //     logWarning(`Looks like your entry folder ${chalk.white(c.paths.entryFolder)} is missing! Let's create one for you.`);
    //     copyFolderContentsRecursiveSync(path.join(c.paths.rnvRootFolder, 'entry'), c.paths.entryFolder);
    // }


    // Check rnv-config.local
    logTask('configureProject:check rnv-config.local');
    if (fs.existsSync(c.paths.projectConfigLocalPath)) {
        logInfo(`Found ${RNV_PROJECT_CONFIG_LOCAL_NAME} file in your project. will use it as preference for appConfig path!`);
        c.files.projectConfigLocal = JSON.parse(fs.readFileSync(c.paths.projectConfigLocalPath).toString());
        if (c.files.projectConfigLocal.appConfigsPath) {
            if (!fs.existsSync(c.files.projectConfigLocal.appConfigsPath)) {
                logWarning(
                    `Looks like your custom local appConfig is pointing to ${chalk.white(
                        c.files.projectConfigLocal.appConfigsPath,
                    )} which doesn't exist! Make sure you create one in that location`,
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk.white(
                        c.files.projectConfigLocal.appConfigsPath,
                    )}. ReNativewill now swith to that location!`,
                );
                c.paths.appConfigsFolder = c.files.projectConfigLocal.appConfigsPath;
            }
        } else {
            logWarning(
                `Your local config file ${chalk.white(c.files.projectConfigLocal.appConfigsPath)} is missing appConfigsPath field!`,
            );
        }
        // c.defaultAppConfigId = c.files.projectConfigLocal.defaultAppConfigId;
    }

    resolve();
});


const configureNodeModules = c => new Promise((resolve, reject) => {
    logTask('configureNodeModules');
    // Check node_modules
    if (!fs.existsSync(c.paths.projectNodeModulesFolder) || c._requiresNpmInstall) {
        if (!fs.existsSync(c.paths.projectNodeModulesFolder)) {
            logWarning(
                `Looks like your node_modules folder ${chalk.white(c.paths.projectNodeModulesFolder)} is missing! Let's run ${chalk.white(
                    'npm install',
                )} first!`,
            );
        } else {
            logWarning(`Looks like your node_modules out of date! Let's run ${chalk.white('npm install')} first!`);
        }
        executeAsync('npm', ['install'])
            .then(() => cleanNodeModules(c))
            .then(() => {
                resolve();
            })
            .catch(error => logError(error));
    } else {
        resolve();
    }
});

const cleanNodeModules = c => new Promise((resolve, reject) => {
    removeDirs([
        path.join(c.paths.projectNodeModulesFolder, 'react-native-safe-area-view/.git'),
        path.join(c.paths.projectNodeModulesFolder, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.projectNodeModulesFolder, 'react-navigation/node_modules/react-native-safe-area-view/.git')
    ]).then(() => resolve()).catch(e => reject(e));
});

const configureRnvGlobal = c => new Promise((resolve, reject) => {
    logTask('configureRnvGlobal');
    // Check globalConfigFolder
    if (fs.existsSync(c.paths.globalConfigFolder)) {
        console.log(`${c.paths.globalConfigFolder} folder exists!`);
    } else {
        console.log(`${c.paths.globalConfigFolder} folder missing! Creating one for you...`);
        mkdirSync(c.paths.globalConfigFolder);
    }

    // Check globalConfig
    if (fs.existsSync(c.paths.globalConfigPath)) {
        console.log(`${c.paths.globalConfigFolder}/${RNV_GLOBAL_CONFIG_NAME} file exists!`);
    } else {
        console.log(`${c.paths.globalConfigFolder}/${RNV_GLOBAL_CONFIG_NAME} file missing! Creating one for you...`);
        copyFileSync(path.join(c.paths.rnvHomeFolder, 'supportFiles', RNV_GLOBAL_CONFIG_NAME), c.paths.globalConfigPath);
        console.log(
            `Don\'t forget to Edit: ${
                c.paths.globalConfigFolder
            }/${RNV_GLOBAL_CONFIG_NAME} with correct paths to your SDKs before continuing!`,
        );
    }

    if (fs.existsSync(c.paths.globalConfigPath)) {
        c.files.globalConfig = JSON.parse(fs.readFileSync(c.paths.globalConfigPath).toString());

        if (c.files.globalConfig.appConfigsPath) {
            if (!fs.existsSync(c.files.globalConfig.appConfigsPath)) {
                logWarning(
                    `Looks like your custom global appConfig is pointing to ${chalk.white(
                        c.files.globalConfig.appConfigsPath,
                    )} which doesn't exist! Make sure you create one in that location`,
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk.white(
                        c.files.globalConfig.appConfigsPath,
                    )}. ReNativewill now swith to that location!`,
                );
                c.paths.appConfigsFolder = c.files.globalConfig.appConfigsPath;
            }
        }

        // Check global SDKs
        c.cli[CLI_ANDROID_EMULATOR] = path.join(c.files.globalConfig.sdks.ANDROID_SDK, 'emulator/emulator');
        c.cli[CLI_ANDROID_ADB] = path.join(c.files.globalConfig.sdks.ANDROID_SDK, 'platform-tools/adb');
        c.cli[CLI_ANDROID_AVDMANAGER] = path.join(c.files.globalConfig.sdks.ANDROID_SDK, 'tools/bin/avdmanager');
        c.cli[CLI_ANDROID_SDKMANAGER] = path.join(c.files.globalConfig.sdks.ANDROID_SDK, 'tools/bin/sdkmanager');
        c.cli[CLI_TIZEN_EMULATOR] = path.join(c.files.globalConfig.sdks.TIZEN_SDK, 'tools/emulator/bin/em-cli');
        c.cli[CLI_TIZEN] = path.join(c.files.globalConfig.sdks.TIZEN_SDK, 'tools/ide/bin/tizen');
        c.cli[CLI_WEBOS_ARES] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares');
        c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-package');
        c.cli[CLI_WEBBOS_ARES_INSTALL] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-install');
        c.cli[CLI_WEBBOS_ARES_LAUNCH] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-launch');

        // Check config sanity
        if (c.files.globalConfig.defaultTargets === undefined) {
            logWarning(
                `Looks like you\'re missing defaultTargets in your config ${chalk.white(c.paths.globalConfigPath)}. Let's add them!`,
            );
            const defaultConfig = JSON.parse(
                fs.readFileSync(path.join(c.paths.rnvHomeFolder, 'supportFiles', RNV_GLOBAL_CONFIG_NAME)).toString(),
            );
            const newConfig = { ...c.files.globalConfig, defaultTargets: defaultConfig.defaultTargets };
            fs.writeFileSync(c.paths.globalConfigPath, JSON.stringify(newConfig, null, 2));
        }
    }

    resolve();
});

const configureEntryPoints = (c) => {
    // Check entry
    // TODO: RN bundle command fails if entry files are not at root
    // logTask('configureProject:check entry');
    // if (!fs.existsSync(c.paths.entryFolder)) {
    //     logWarning(`Looks like your entry folder ${chalk.white(c.paths.entryFolder)} is missing! Let's create one for you.`);
    //     copyFolderContentsRecursiveSync(path.join(c.paths.rnvRootFolder, 'entry'), c.paths.entryFolder);
    // }
    const p = c.files.appConfigFile.platforms;
    for (const k in p) {
        platform = p[k];
        const source = path.join(c.paths.rnvRootFolder, 'supportFiles/entry', `${platform.entryFile}.js`);
        const dest = path.join(c.paths.projectRootFolder, `${platform.entryFile}.js`);
        if (!fs.existsSync(dest)) {
            logWarning(`You missing entry file ${chalk.white(platform.entryFile)} in your project. let's create one for you!`);
            copyFileSync(source, dest);
        }
    }
};

const configureApp = c => new Promise((resolve, reject) => {
    logTask('configureApp');

    if (c.appID) {
        // App ID specified
        _getConfig(c, c.appID)
            .then(() => {
                configureEntryPoints(c);
                resolve(c);
            })
            .catch(e => reject(e));
    } else {
        // Use latest app from platformAssets
        if (!fs.existsSync(c.paths.runtimeConfigPath)) {
            logWarning(
                `Seems like you're missing ${
                    c.paths.runtimeConfigPath
                } file. But don't worry. ReNative got you covered. Let's configure it for you!`,
            );

            _getConfig(c, c.defaultAppConfigId)
                .then(() => {
                    configureEntryPoints(c);

                    const newCommand = Object.assign({}, c);
                    newCommand.subCommand = 'configure';
                    newCommand.program = {
                        appConfig: c.defaultAppConfigId,
                        update: true,
                        platform: c.program.platform,
                        scheme: c.program.scheme,
                    };
                    appRunner(newCommand)
                        .then(() => resolve(c))
                        .catch(e => reject(e));
                })
                .catch(e => reject(e));
        } else {
            try {
                const assetConfig = JSON.parse(fs.readFileSync(c.paths.runtimeConfigPath).toString());
                _getConfig(c, assetConfig.id)
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
    console.log(chalk.white.bold(`\n ${RNV} ${_currentJob || ''} - Done! 🚀`));
    if (isEnd) logEnd(0);
};

const logSuccess = (msg) => {
    console.log(`\n ✅ ${chalk.magenta(msg)}`);
};

const getQuestion = msg => chalk.blue(`\n ❓ ${msg}: `);

const logError = (e, isEnd = false) => {
    if (e && e.message) {
        console.log(chalk.red.bold(`\n${RNV} ${_currentJob} - ERRROR! ${e.message}\n${e.stack}`));
    } else {
        console.log(chalk.red.bold(`\n${RNV} ${_currentJob} - ERRROR! ${e}`));
    }
    if (isEnd) logEnd(1);
};

const logEnd = (code) => {
    console.log(chalk.bold(`\n${LINE}\n`));
    _currentProcess.exit(code);
};

const IGNORE_FOLDERS = ['.git'];

const _getConfig = (c, appConfigId) => new Promise((resolve, reject) => {
    logTask(`_getConfig:${appConfigId}`);

    _setAppConfig(c, path.join(c.paths.appConfigsFolder, appConfigId));
    c.appId = appConfigId;

    if (!fs.existsSync(c.paths.appConfigFolder)) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const configDirs = [];
        fs.readdirSync(c.paths.appConfigsFolder).forEach((dir) => {
            if (!IGNORE_FOLDERS.includes(dir) && fs.lstatSync(path.join(c.paths.appConfigsFolder, dir)).isDirectory()) {
                configDirs.push(dir);
            }
        });

        logWarning(
            `It seems you don't have appConfig named ${chalk.white(appConfigId)} present in your config folder: ${chalk.white(
                c.paths.appConfigsFolder,
            )} !`,
        );
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
                        c.appId = c.defaultAppConfigId;
                        _setAppConfig(c, path.join(c.paths.appConfigsFolder, c.defaultAppConfigId));
                        _configureConfig(c)
                            .then(() => resolve())
                            .catch(e => reject(e));
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
                    _setAppConfig(c, path.join(c.paths.appConfigsFolder, c.defaultAppConfigId));
                    copyFolderContentsRecursiveSync(
                        path.join(c.paths.rnvRootFolder, 'appConfigs', c.defaultAppConfigId),
                        path.join(c.paths.appConfigFolder),
                    );
                    _configureConfig(c)
                        .then(() => resolve())
                        .catch(e => reject(e));
                },
            );
        }
    } else {
        _configureConfig(c)
            .then(() => resolve())
            .catch(e => reject(e));
    }
});

const _configureConfig = c => new Promise((resolve, reject) => {
    logTask(`_configureConfig:${c.appId}`);
    c.files.appConfigFile = JSON.parse(fs.readFileSync(c.paths.appConfigPath).toString());

    // EXTEND CONFIG
    const merge = require('deepmerge');
    try {
        if (c.files.appConfigFile.extend) {
            const parentAppConfigFolder = path.join(c.paths.appConfigsFolder, c.files.appConfigFile.extend);
            if (fs.existsSync(parentAppConfigFolder)) {
                const parentAppConfigPath = path.join(parentAppConfigFolder, RNV_APP_CONFIG_NAME);
                const parentAppConfigFile = JSON.parse(fs.readFileSync(parentAppConfigPath).toString());
                const mergedAppConfigFile = merge(parentAppConfigFile, c.files.appConfigFile);
                c.files.appConfigFile = mergedAppConfigFile;
                _setAppConfig(c, parentAppConfigFolder);
            }
        }
        resolve();
    } catch (e) {
        reject(e);
    }
});

const getAppFolder = (c, platform) => path.join(c.paths.platformBuildsFolder, `${c.appId}_${platform}`);

const getAppTemplateFolder = (c, platform) => path.join(c.paths.platformTemplatesFolder, `${platform}`);

const getAppConfigId = (c, platform) => c.files.appConfigFile.id;

const getConfigProp = (c, platform, key) => {
    const p = c.files.appConfigFile.platforms[platform];
    const ps = _getScheme(c);
    let scheme;
    scheme = p.buildSchemes ? p.buildSchemes[ps] : null;
    scheme = scheme || {};
    const result = scheme[key] || (c.files.appConfigFile.platforms[platform][key] || c.files.appConfigFile.common[key]);
    logTask(`getConfigProp:${platform}:${key}:${result}`);
    return result;
};

const getAppId = (c, platform) => getConfigProp(c, platform, 'id');

const getAppTitle = (c, platform) => getConfigProp(c, platform, 'title');

const getAppVersion = (c, platform) => c.files.appConfigFile.platforms[platform].version || c.files.appConfigFile.common.verion || c.files.projectPackage.version;

const getAppAuthor = (c, platform) => c.files.appConfigFile.platforms[platform].author || c.files.appConfigFile.common.author || c.files.projectPackage.author;

const getAppLicense = (c, platform) => c.files.appConfigFile.platforms[platform].license || c.files.appConfigFile.common.license || c.files.projectPackage.license;

const getEntryFile = (c, platform) => c.files.appConfigFile.platforms[platform].entryFile;

const getAppDescription = (c, platform) => c.files.appConfigFile.platforms[platform].description || c.files.appConfigFile.common.description || c.files.projectPackage.description;

const getAppVersionCode = (c, platform) => {
    if (c.files.appConfigFile.platforms[platform].versionCode) {
        return c.files.appConfigFile.platforms[platform].versionCode;
    }
    if (c.files.appConfigFile.common.verionCode) {
        return c.files.appConfigFile.common.verionCode;
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
    logError(`Platform: ${chalk.white(platform)} doesn't support command: ${chalk.white(_currentJob)}`);
    resolve();
};

const isPlatformActive = (c, platform, resolve) => {
    if (!c.files.appConfigFile || !c.files.appConfigFile.platforms) {
        logError(`Looks like your appConfigFile is not configured properly! check ${chalk.white(c.paths.appConfigPath)} location.`);
        if (resolve) resolve();
        return false;
    }
    if (!c.files.appConfigFile.platforms[platform]) {
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
    newCommand.program = {
        appConfig: c.id,
        update: false,
        platform,
        scheme: c.program.scheme,
    };

    if (c.program.reset) {
        cleanPlatformBuild(c, platform)
            .then(() => createPlatformBuild(c, platform))
            .then(() => appRunner(newCommand))
            .then(() => resolve(c))
            .catch(e => reject(e));
    } else {
        createPlatformBuild(c, platform)
            .then(() => appRunner(newCommand))
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

    // FOLDER MERGERS
    const destPath = path.join(getAppFolder(c, platform));
    const sourcePath = _getBuildsFolder(c, platform);
    copyFolderContentsRecursiveSync(sourcePath, destPath);
    resolve();
});

const _getScheme = c => c.program.scheme || 'debug';

const _getBuildsFolder = (c, platform) => {
    const p = path.join(c.paths.appConfigFolder, `builds/${platform}@${_getScheme(c)}`);
    if (fs.existsSync(p)) return p;
    return path.join(c.paths.appConfigFolder, `builds/${platform}`);
};

const getIP = () => {
    const ip = require('ip');
    return ip.address();
};

const _setAppConfig = (c, p) => {
    c.paths.appConfigFolder = p;
    c.paths.appConfigPath = path.join(p, RNV_APP_CONFIG_NAME);
};

const cleanPlatformIfRequired = (c, platform) => new Promise((resolve, reject) => {
    if (c.program.reset) {
        logWarning(`You passed ${chalk.white('-r')} argument. paltform ${chalk.white(platform)} will be cleaned up first!`);
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

const generateOptions = (inputData, isMultiChoice = false, mapping) => {
    let asString = '';
    const valuesAsObject = {};
    const valuesAsArray = [];
    const keysAsObject = {};
    const keysAsArray = [];
    const isArray = Array.isArray(inputData);

    const output = {
        pick: (v, defaultOption) => new Promise((resolve, reject) => {
            let selectedOptions = [];
            const pickedOpt = v || defaultOption;
            if (isMultiChoice) {
                const wrongOptions = [];
                if (pickedOpt) {
                    const choiceArr = v.split(',');
                    choiceArr.forEach((choice) => {
                        let selectedOption = choice;
                        if (isNaN(choice)) {
                            selectedOption = choice;
                        } else {
                            selectedOption = keysAsArray[choice - 1];
                        }
                        selectedOptions.push(selectedOption);
                        if (!valuesAsObject[selectedOption]) {
                            wrongOptions.push(choice);
                        }
                    });
                } else {
                    selectedOptions = keysAsArray;
                }
                if (wrongOptions.length) {
                    reject(`${chalk.white(wrongOptions.join(','))} ...Really?! 🙈`);
                } else {
                    output.selectedOptions = selectedOptions;
                    resolve(selectedOptions);
                }
            } else {
                let selectedOption = pickedOpt;
                if (isNaN(pickedOpt)) {
                    selectedOption = pickedOpt;
                } else {
                    selectedOption = keysAsArray[v - 1];
                }
                if (!valuesAsObject[selectedOption]) {
                    reject(`${chalk.white(pickedOpt)} ...Really?! 🙈`);
                } else {
                    output.selectedOption = selectedOption;
                    resolve(selectedOption);
                }
            }
        })
    };
    if (isArray) {
        inputData.map((v, i) => {
            asString += _generateOptionString(i, v, mapping, v);
            valuesAsArray.push(v);
            if (!mapping) keysAsArray.push(v);
            if (!mapping) valuesAsObject[v] = v;
        });
    } else {
        let i = 0;
        for (const k in inputData) {
            const v = inputData[k];
            asString += _generateOptionString(i, v, mapping, k);
            keysAsArray.push(k);
            keysAsObject[k] = true;
            valuesAsObject[k] = v;
            valuesAsArray.push(v);
            i++;
        }
    }
    output.keysAsArray = keysAsArray;
    output.valuesAsArray = valuesAsArray;
    output.keysAsObject = keysAsObject;
    output.valuesAsObject = valuesAsObject;
    output.asString = asString;
    return output;
};

const _generateOptionString = (i, obj, mapping, defaultVal) => `-[${i + 1}] ${chalk.white(mapping ? '' : defaultVal)} \n`;

let _currentQuestion;

const askQuestion = (question, obj, key) => new Promise((resolve, reject) => {
    if (!_currentQuestion) {
        _currentQuestion = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    _currentQuestion.question(getQuestion(question), (v) => {
        if (obj && key) obj[key] = v;
        resolve(v === '' ? null : v);
    });
});

const finishQuestion = () => new Promise((resolve, reject) => {
    _currentQuestion.close();
    _currentQuestion = null;
});

export {
    SUPPORTED_PLATFORMS,
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
    getAppConfigId,
    getAppDescription,
    getAppAuthor,
    getAppLicense,
    getQuestion,
    logSuccess,
    getConfigProp,
    getIP,
    cleanPlatformIfRequired,
    checkPortInUse,
    finishQuestion,
    askQuestion,
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
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
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

export default {
    SUPPORTED_PLATFORMS,
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
    getConfigProp,
    getIP,
    cleanPlatformIfRequired,
    checkPortInUse,
    finishQuestion,
    askQuestion,
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
