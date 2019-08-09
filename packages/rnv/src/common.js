/* eslint-disable import/no-cycle */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import detectPort from 'detect-port';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath
} from './systemTools/fileutils';
import { createPlatformBuild, cleanPlatformBuild } from './cli/platform';
import appRunner, { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore } from './cli/app';
import { configureTizenGlobal } from './platformTools/tizen';
import { applyTemplate, checkIfTemplateInstalled } from './templateTools';
import { getMergedPlugin, parsePlugins } from './pluginTools';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo
} from './systemTools/logger';
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
    RNV_PROJECT_CONFIG_NAME,
    RNV_GLOBAL_CONFIG_NAME,
    RNV_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    PLATFORMS
} from './constants';
import { executeAsync } from './systemTools/exec';

const SUPPORTED_PLATFORMS = [
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
    TIZEN_MOBILE,
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
    TIZEN_MOBILE,
    WEBOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
];

const SUPPORTED_PLATFORMS_LINUX = [ANDROID, ANDROID_TV, ANDROID_WEAR];

const highlight = chalk.green;

const base = path.resolve('.');
const homedir = require('os').homedir();

const SDK_PLATFORMS = {};
SDK_PLATFORMS[ANDROID] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_TV] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_WEAR] = ANDROID_SDK;
SDK_PLATFORMS[TIZEN] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_WATCH] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_MOBILE] = TIZEN_SDK;
SDK_PLATFORMS[WEBOS] = WEBOS_SDK;
SDK_PLATFORMS[KAIOS] = KAIOS_SDK;


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
        let platformsAsObj = c.files.appConfigFile ? c.files.appConfigFile.platforms : c.supportedPlatforms;
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

    if (!c.files.appConfigFile.platforms[c.platform]) {
        c.files.appConfigFile.platforms[c.platform] = {};
    }

    const { buildSchemes } = c.files.appConfigFile.platforms[c.platform];


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

const _generatePlatformTemplatePaths = (c) => {
    const pt = c.files.projectConfig.platformTemplatesFolders || {};
    const originalPath = c.files.projectConfig.platformTemplatesFolder || 'RNV_HOME/platformTemplates';
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

const initializeBuilder = (cmd, subCmd, process, program) => new Promise((resolve, reject) => {
    const c = { cli: {}, paths: {}, files: {} };

    c.program = program;
    c.process = process;
    c.command = cmd;
    c.subCommand = subCmd;
    c.platformDefaults = PLATFORMS;
    c.appId = program.appConfigID;
    c.paths.rnvRootFolder = path.join(__dirname, '..');
    c.paths.rnvHomeFolder = path.join(__dirname, '..');
    c.paths.rnvPlatformTemplatesFolder = path.join(c.paths.rnvHomeFolder, 'platformTemplates');
    c.paths.rnvPluginTemplatesFolder = path.join(c.paths.rnvHomeFolder, 'pluginTemplates');
    c.paths.rnvPluginTemplatesConfigPath = path.join(c.paths.rnvPluginTemplatesFolder, 'plugins.json');
    c.paths.rnvPackagePath = path.join(c.paths.rnvRootFolder, 'package.json');
    c.paths.rnvPluginsFolder = path.join(c.paths.rnvHomeFolder, 'plugins');
    c.paths.rnvProjectTemplateFolder = path.join(c.paths.rnvRootFolder, 'projectTemplate');
    c.files.rnvPackage = JSON.parse(fs.readFileSync(c.paths.rnvPackagePath).toString());

    configureLogger(c, c.process, c.command, c.subCommand, program.info === true);
    logInitialize();

    resolve(c);
});

const startBuilder = c => new Promise((resolve, reject) => {
    logTask('initializeBuilder');

    c.files.pluginTemplatesConfig = JSON.parse(fs.readFileSync(path.join(c.paths.rnvPluginTemplatesConfigPath)).toString());

    if ((c.command === 'app' && c.subCommand === 'create') || c.command === 'new') {
        resolve(c);
        return;
    }

    c.platform = c.program.platform;
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
    c.paths.appConfigsFolder = path.join(c.paths.projectRootFolder, 'appConfigs');
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
        if (!c.files.projectConfig.defaultProjectConfigs) {
            logWarning(`You're missing ${chalk.white('defaultProjectConfigs')} in your ${chalk.white(c.paths.projectConfigPath)}. ReNative will generate temporary one`);
            c.files.projectConfig.defaultProjectConfigs = {};
        }
        if (!c.files.projectConfig.defaultProjectConfigs.supportedPlatforms) {
            if (c.files.projectPackage.supportedPlatforms) {
                c.files.projectConfig.defaultProjectConfigs.supportedPlatforms = c.files.projectPackage.supportedPlatforms;
            } else {
                c.files.projectConfig.defaultProjectConfigs.supportedPlatforms = SUPPORTED_PLATFORMS;
            }

            logWarning(`You're missing ${chalk.white('supportedPlatforms')} in your ${chalk.white(c.paths.projectConfigPath)}. ReNative will generate temporary one`);
        }
        c.isWrapper = c.files.projectConfig.isWrapper;
        c.paths.globalConfigFolder = getRealPath(c, c.files.projectConfig.globalConfigFolder, 'globalConfigFolder', c.paths.globalConfigFolder);
        c.paths.globalConfigPath = path.join(c.paths.globalConfigFolder, RNV_GLOBAL_CONFIG_NAME);
        c.paths.appConfigsFolder = getRealPath(c, c.files.projectConfig.appConfigsFolder, 'appConfigsFolder', c.paths.appConfigsFolder);
        c.paths.platformTemplatesFolders = _generatePlatformTemplatePaths(c);
        c.paths.platformAssetsFolder = getRealPath(
            c,
            c.files.projectConfig.platformAssetsFolder,
            'platformAssetsFolder',
            c.paths.platformAssetsFolder,
        );
        c.paths.platformBuildsFolder = getRealPath(
            c,
            c.files.projectConfig.platformBuildsFolder,
            'platformBuildsFolder',
            c.paths.platformBuildsFolder,
        );
        c.paths.projectPluginsFolder = getRealPath(c, c.files.projectConfig.projectPlugins, 'projectPlugins', c.paths.projectPluginsFolder);
        c.paths.projectNodeModulesFolder = path.join(c.paths.projectRootFolder, 'node_modules');
        c.paths.rnvNodeModulesFolder = path.join(c.paths.rnvRootFolder, 'node_modules');
        c.paths.runtimeConfigPath = path.join(c.paths.platformAssetsFolder, RNV_APP_CONFIG_NAME);
        c.paths.projectConfigFolder = getRealPath(
            c,
            c.files.projectConfig.projectConfigFolder,
            'projectConfigFolder',
            c.paths.projectConfigFolder,
        );
        c.paths.pluginConfigPath = path.join(c.paths.projectConfigFolder, 'plugins.json');
        c.paths.permissionsConfigPath = path.join(c.paths.projectConfigFolder, 'permissions.json');
        c.paths.fontsConfigFolder = path.join(c.paths.projectConfigFolder, 'fonts');
    }

    if (c.command === 'target' || c.command === 'log' || c.subCommand === 'fixPackage') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    if (!hasProjectConfigInCurrentDir) {
        reject(
            `Looks like this directory is not ReNative project. Project config ${chalk.white(
                c.paths.projectConfigPath,
            )} is missing!. You can create new project with ${chalk.white('rnv new')}`,
        );
    }

    if (c.command === 'platform') {
        configureRnvGlobal(c)
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    if (c.command === 'fix' || c.command === 'clean' || c.command === 'tool' || c.command === 'status') {
        gatherInfo(c)
            .then(() => resolve(c))
            .catch(e => reject(c));
        return;
    }

    configureRnvGlobal(c)
        .then(() => checkIfTemplateInstalled(c))
        .then(() => configureProject(c))
        .then(() => configureNodeModules(c))
        .then(() => applyTemplate(c))
        .then(() => configurePlugins(c))
        .then(() => configureNodeModules(c))
    // .then(() => configureTizenGlobal(c))
    // .then(() => configureAndroidGlobal(c))
        .then(() => configureApp(c))
        .then(() => logAppInfo(c))
        .then(() => resolve(c))
        .catch(e => reject(e));
});

const gatherInfo = c => new Promise((resolve, reject) => {
    logTask('gatherInfo');
    try {
        if (fs.existsSync(c.paths.projectPackagePath)) {
            c.files.projectPackage = JSON.parse(fs.readFileSync(c.paths.projectPackagePath).toString());
        } else {
            console.log('Missing appConfigPath', c.paths.projectPackagePath);
        }
        if (fs.existsSync(c.paths.runtimeConfigPath)) {
            c.files.appConfigFile = JSON.parse(fs.readFileSync(c.paths.runtimeConfigPath).toString());
            c.appId = c.files.appConfigFile.id;
        } else {
            console.log('Missing runtimeConfigPath', c.paths.runtimeConfigPath);
        }
        if (fs.existsSync(c.paths.projectConfigPath)) {
            c.files.projectConfig = JSON.parse(fs.readFileSync(c.paths.projectConfigPath).toString());
        } else {
            console.log('Missing projectConfigPath', c.paths.projectConfigPath);
        }
        // console.log('SJKHHJS', c.files);
    } catch (e) {
        reject(e);
    }

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
    logTask('configureProject:check rn-cli', chalk.grey);
    if (!fs.existsSync(c.paths.rnCliConfigPath)) {
        logWarning(
            `Looks like your rn-cli config file ${chalk.white(c.paths.rnCliConfigPath)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnvProjectTemplateFolder, RN_CLI_CONFIG_NAME), c.paths.rnCliConfigPath);
    }

    // Check babel-config
    logTask('configureProject:check babel config', chalk.grey);
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
    logTask('configureProject:check rnv-config.local', chalk.grey);
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
                `Your local config file ${chalk.white(c.paths.projectConfigLocalPath)} is missing ${chalk.white('{ appConfigsPath: "" }')} field!`,
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
    logTask(`cleanNodeModules:${c.paths.projectNodeModulesFolder}`);
    removeDirs([
        path.join(c.paths.projectNodeModulesFolder, 'react-native-safe-area-view/.git'),
        path.join(c.paths.projectNodeModulesFolder, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.projectNodeModulesFolder, 'react-navigation/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.rnvNodeModulesFolder, 'react-native-safe-area-view/.git'),
        path.join(c.paths.rnvNodeModulesFolder, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        path.join(c.paths.rnvNodeModulesFolder, 'react-navigation/node_modules/react-native-safe-area-view/.git')
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
        copyFileSync(path.join(c.paths.rnvHomeFolder, 'supportFiles', 'global-config-template.json'), c.paths.globalConfigPath);
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
        const { sdks } = c.files.globalConfig;
        if (sdks) {
            if (sdks.ANDROID_SDK) {
                c.cli[CLI_ANDROID_EMULATOR] = path.join(sdks.ANDROID_SDK, 'emulator/emulator');
                c.cli[CLI_ANDROID_ADB] = path.join(sdks.ANDROID_SDK, 'platform-tools/adb');
                c.cli[CLI_ANDROID_AVDMANAGER] = path.join(sdks.ANDROID_SDK, 'tools/bin/avdmanager');
                c.cli[CLI_ANDROID_SDKMANAGER] = path.join(sdks.ANDROID_SDK, 'tools/bin/sdkmanager');
            }
            if (sdks.TIZEN_SDK) {
                c.cli[CLI_TIZEN_EMULATOR] = path.join(sdks.TIZEN_SDK, 'tools/emulator/bin/em-cli');
                c.cli[CLI_TIZEN] = path.join(sdks.TIZEN_SDK, 'tools/ide/bin/tizen');
                c.cli[CLI_SDB_TIZEN] = path.join(sdks.TIZEN_SDK, 'tools/sdb');
            }
            if (sdks.WEBOS_SDK) {
                c.cli[CLI_WEBOS_ARES] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares');
                c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-package');
                c.cli[CLI_WEBOS_ARES_INSTALL] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-install');
                c.cli[CLI_WEBOS_ARES_LAUNCH] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-launch');
                c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-setup-device');
                c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-device-info');
                c.cli[CLI_WEBOS_ARES_NOVACOM] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-novacom');
            }
        } else {
            logWarning(`Your ${c.paths.globalConfigPath} is missing SDK configuration object`);
        }


        // Check config sanity
        if (c.files.globalConfig.defaultTargets === undefined) {
            logWarning(
                `Looks like you\'re missing defaultTargets in your config ${chalk.white(c.paths.globalConfigPath)}. Let's add them!`,
            );
            const defaultConfig = JSON.parse(
                fs.readFileSync(path.join(c.paths.rnvHomeFolder, 'supportFiles', 'global-config-template.json')).toString(),
            );
            const newConfig = { ...c.files.globalConfig, defaultTargets: defaultConfig.defaultTargets };
            fs.writeFileSync(c.paths.globalConfigPath, JSON.stringify(newConfig, null, 2));
        }
    }

    resolve();
});

const configureEntryPoints = (c) => {
    logTask('configureEntryPoints');
    // Check entry
    // TODO: RN bundle command fails if entry files are not at root
    // logTask('configureProject:check entry');
    // if (!fs.existsSync(c.paths.entryFolder)) {
    //     logWarning(`Looks like your entry folder ${chalk.white(c.paths.entryFolder)} is missing! Let's create one for you.`);
    //     copyFolderContentsRecursiveSync(path.join(c.paths.rnvRootFolder, 'entry'), c.paths.entryFolder);
    // }
    let plat;
    const p = c.files.appConfigFile.platforms;
    for (const k in p) {
        plat = p[k];
        const source = path.join(c.paths.projectTemplateFolder, `${plat.entryFile}.js`);
        const backupSource = path.join(c.paths.rnvProjectTemplateFolder, 'entry', `${plat.entryFile}.js`);
        const dest = path.join(c.paths.projectRootFolder, `${plat.entryFile}.js`);
        if (!fs.existsSync(dest)) {
            if (!plat.entryFile) {
                logError(`You missing entryFile for ${chalk.white(k)} platform in your ${chalk.white(c.paths.appConfigPath)}.`);
            } else if (!fs.existsSync(source)) {
                logWarning(`You missing entry file ${chalk.white(source)} in your template. ReNative Will use default backup entry from ${chalk.white(backupSource)}!`);
                copyFileSync(backupSource, dest);
            } else {
                logWarning(`You missing entry file ${chalk.white(plat.entryFile)} in your project. let's create one for you!`);
                copyFileSync(source, dest);
            }
        }
    }
};

const configurePlugins = c => new Promise((resolve, reject) => {
    // Check plugins
    logTask('configureProject:check plugins', chalk.grey);
    if (fs.existsSync(c.paths.pluginConfigPath)) {
        c.files.pluginConfig = readObjectSync(c.paths.pluginConfigPath, c);
    } else {
        logWarning(
            `Looks like your plugin config is missing from ${chalk.white(c.paths.pluginConfigPath)}. let's create one for you!`,
        );
        c.files.pluginConfig = { plugins: {} };
        fs.writeFileSync(c.paths.pluginConfigPath, JSON.stringify(c.files.pluginConfig, null, 2));
    }

    if (!c.files.projectPackage.dependencies) {
        c.files.projectPackage.dependencies = {};
    }

    let hasPackageChanged = false;
    for (const k in c.files.pluginConfig.plugins) {
        const dependencies = c.files.projectPackage.dependencies;
        const devDependencies = c.files.projectPackage.devDependencies;
        const plugin = getMergedPlugin(c, k, c.files.pluginConfig.plugins);

        if (!plugin) {
            logWarning(`Plugin with name ${
                chalk.white(k)} does not exists in ReNative source:rnv scope. you need to define it manually here: ${
                chalk.white(c.paths.pluginConfigPath)}`);
        } else if (dependencies && dependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && dependencies[k] !== plugin.version) {
                if (k === 'renative' && c.isWrapper) {
                    logWarning('You\'re in ReNative wrapper mode. plugin renative will stay as local dep!');
                } else {
                    logWarning(
                        `Version mismatch of dependency ${chalk.white(k)} between:
  ${chalk.white(c.paths.projectPackagePath)}: v(${chalk.red(dependencies[k])}) and
  ${chalk.white(c.paths.pluginConfigPath)}: v(${chalk.green(plugin.version)}).
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
        writeObjectSync(c.paths.projectPackagePath, c.files.projectPackage);
        c._requiresNpmInstall = true;
    }

    // Check permissions
    logTask('configureProject:check permissions', chalk.grey);
    if (fs.existsSync(c.paths.permissionsConfigPath)) {
        c.files.permissionsConfig = JSON.parse(fs.readFileSync(c.paths.permissionsConfigPath).toString());
    } else {
        const newPath = path.join(c.paths.rnvRootFolder, 'projectConfig/permissions.json');
        logWarning(
            `Looks like your permission config is missing from ${chalk.white(
                c.paths.permissionsConfigPath,
            )}. ReNative Default ${chalk.white(newPath)} will be used instead`,
        );
        c.paths.permissionsConfigPath = newPath;
        c.files.permissionsConfig = JSON.parse(fs.readFileSync(c.paths.permissionsConfigPath).toString());
    }

    resolve();
});

const configureApp = c => new Promise((resolve, reject) => {
    logTask('configureApp');

    if (c.appId) {
        // App ID specified
        _getConfig(c, c.appId)
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
        reject && reject(`${platform} requires SDK to be installed. check your ${c.paths.globalConfigPath} file if you SDK path is correct`);
        return false;
    }
    return true;
};

const getQuestion = msg => chalk.blue(`\n ❓ ${msg}: `);

const IGNORE_FOLDERS = ['.git'];

const _getConfig = (c, appConfigId) => new Promise((resolve, reject) => {
    logTask(`_getConfig:${appConfigId}`);

    setAppConfig(c, path.join(c.paths.appConfigsFolder, appConfigId));
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

        if (appConfigId !== '?') {
            logWarning(
                `It seems you don't have appConfig named ${chalk.white(appConfigId)} present in your config folder: ${chalk.white(
                    c.paths.appConfigsFolder,
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
                        c.appId = c.defaultAppConfigId;
                        setAppConfig(c, path.join(c.paths.appConfigsFolder, c.defaultAppConfigId));
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
                    setAppConfig(c, path.join(c.paths.appConfigsFolder, c.defaultAppConfigId));
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

const _arrayMergeOverride = (destinationArray, sourceArray, mergeOptions) => sourceArray;

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
                const mergedAppConfigFile = merge(parentAppConfigFile, c.files.appConfigFile, { arrayMerge: _arrayMergeOverride });
                c.files.appConfigFile = mergedAppConfigFile;
                setAppConfig(c, parentAppConfigFolder);
            }
        }
        resolve();
    } catch (e) {
        reject(e);
    }
});

const getAppFolder = (c, platform) => path.join(c.paths.platformBuildsFolder, `${c.appId}_${platform}`);

const getAppTemplateFolder = (c, platform) => path.join(c.paths.platformTemplatesFolders[platform], `${platform}`);

const getAppConfigId = (c, platform) => c.files.appConfigFile.id;

const _getValueOrMergedObject = (o1, o2, o3) => {
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

const getConfigProp = (c, platform, key, defaultVal) => {
    const p = c.files.appConfigFile.platforms[platform];
    const ps = _getScheme(c);
    let scheme;
    scheme = p.buildSchemes ? p.buildSchemes[ps] : null;
    scheme = scheme || {};
    const resultScheme = scheme[key];
    const resultPlatforms = c.files.appConfigFile.platforms[platform][key];
    const resultCommon = c.files.appConfigFile.common[key];

    const result = _getValueOrMergedObject(resultScheme, resultPlatforms, resultCommon);

    logTask(`getConfigProp:${platform}:${key}:${result}`, chalk.grey);
    if (result === null || result === undefined) return defaultVal;
    return result;
};

const getJsBundleFileDefaults = {
    android: 'super.getJSBundleFile()',
    androidtv: 'super.getJSBundleFile()',
    //CRAPPY BUT Android Wear does not support webview required for connecting to packager
    androidwear: '"assets://index.androidwear.bundle"',
};

const getAppId = (c, platform) => getConfigProp(c, platform, 'id');

const getAppTitle = (c, platform) => getConfigProp(c, platform, 'title');

const getAppVersion = (c, platform) => c.files.appConfigFile.platforms[platform].version || c.files.appConfigFile.common.verion || c.files.projectPackage.version;

const getAppAuthor = (c, platform) => c.files.appConfigFile.platforms[platform].author || c.files.appConfigFile.common.author || c.files.projectPackage.author;

const getAppLicense = (c, platform) => c.files.appConfigFile.platforms[platform].license || c.files.appConfigFile.common.license || c.files.projectPackage.license;

const getEntryFile = (c, platform) => c.files.appConfigFile.platforms[platform].entryFile;

const getGetJsBundleFile = (c, platform) => c.files.appConfigFile.platforms[platform].getJsBundleFile || getJsBundleFileDefaults[platform];

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
    logError(`Platform: ${chalk.white(platform)} doesn't support command: ${chalk.white(c.command)}`);
    resolve && resolve();
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

const PLATFORM_RUNS = {};

const configureIfRequired = (c, platform) => new Promise((resolve, reject) => {
    logTask(`_configureIfRequired:${platform}`);

    if (PLATFORM_RUNS[platform]) {
        resolve();
        return;
    }
    PLATFORM_RUNS[platform] = true;
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

    // FOLDER MERGERS FROM APP CONFIG
    const destPath = path.join(getAppFolder(c, platform));
    const sourcePath0 = getBuildsFolder(c, platform);
    copyFolderContentsRecursiveSync(sourcePath0, destPath);

    // FOLDER MERGERS PROJECT CONFIG
    const sourcePath1 = getBuildsFolder(c, platform, c.paths.projectConfigFolder);
    copyFolderContentsRecursiveSync(sourcePath1, destPath);

    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getBuildsFolder(c, platform, path.join(c.paths.appConfigFolder, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2, destPath);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getBuildsFolder(c, platform, path.join(c.paths.projectConfigFolder, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3, destPath);
    });

    resolve();
});

const _getScheme = c => c.program.scheme || 'debug';

const getBuildsFolder = (c, platform, customPath) => {
    const pp = customPath || c.paths.appConfigFolder;
    const p = path.join(pp, `builds/${platform}@${_getScheme(c)}`);
    if (fs.existsSync(p)) return p;
    return path.join(pp, `builds/${platform}`);
};

const getIP = () => {
    const ip = require('ip');
    return ip.address();
};

const setAppConfig = (c, p) => {
    c.paths.appConfigFolder = p;
    c.paths.appConfigPath = path.join(p, RNV_APP_CONFIG_NAME);
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

const generateOptions = (inputData, isMultiChoice = false, mapping, renderMethod) => {
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
                    reject(`${highlight(wrongOptions.join(','))} ...Really?! 🙈`);
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
                    reject(`${highlight(pickedOpt)} ...Really?! 🙈`);
                } else {
                    output.selectedOption = selectedOption;
                    resolve(selectedOption);
                }
            }
        })
    };
    const renderer = renderMethod || _generateOptionString;
    if (isArray) {
        inputData.map((v, i) => {
            asString += renderer(i, v, mapping, v);
            valuesAsArray.push(v);
            if (!mapping) keysAsArray.push(v);
            if (!mapping) valuesAsObject[v] = v;
        });
    } else {
        let i = 0;
        for (const k in inputData) {
            const v = inputData[k];
            asString += renderer(i, v, mapping, k);
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

const _generateOptionString = (i, obj, mapping, defaultVal) => `-[${highlight(i + 1)}] ${highlight(mapping ? '' : defaultVal)} \n`;

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

const resolveNodeModulePath = (c, filePath) => {
    let pth = path.join(c.paths.rnvNodeModulesFolder, filePath);
    if (!fs.existsSync(pth)) {
        pth = path.join(c.paths.projectNodeModulesFolder, filePath);
    }
    return pth;
};

const getBuildFilePath = (c, platform, filePath) => {
    // P1 => platformTemplates
    let sp = path.join(getAppTemplateFolder(c, platform), filePath);
    // P2 => projectConfigs + @buildSchemes
    const sp2 = path.join(getBuildsFolder(c, platform, c.paths.projectConfigFolder), filePath);
    if (fs.existsSync(sp2)) sp = sp2;
    // P3 => appConfigs + @buildSchemes
    const sp3 = path.join(getBuildsFolder(c, platform), filePath);
    if (fs.existsSync(sp3)) sp = sp3;
    return sp;
};

export {
    SUPPORTED_PLATFORMS,
    getBuildFilePath,
    configureEntryPoints,
    getBuildsFolder,
    setAppConfig,
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
    getQuestion,
    logSuccess,
    getConfigProp,
    getIP,
    cleanPlatformIfRequired,
    checkPortInUse,
    finishQuestion,
    askQuestion,
    resolveNodeModulePath,
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
    CLI_SDB_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
};

export default {
    SUPPORTED_PLATFORMS,
    getBuildFilePath,
    getBuildsFolder,
    configureEntryPoints,
    setAppConfig,
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
    getQuestion,
    logSuccess,
    getConfigProp,
    getIP,
    cleanPlatformIfRequired,
    checkPortInUse,
    finishQuestion,
    askQuestion,
    resolveNodeModulePath,
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
    TIZEN_WATCH,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
};
