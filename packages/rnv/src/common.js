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
import appRunner, { copyRuntimeAssets, checkAndCreateProjectPackage, checkAndCreateGitignore } from './cli/app';
import { configureTizenGlobal } from './platformTools/tizen';
import { applyTemplate, checkIfTemplateInstalled } from './templateTools';
import { getMergedPlugin, parsePlugins } from './pluginTools';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
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
    RNV_PRIVATE_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    PLATFORMS
} from './constants';
import { executeAsync } from './systemTools/exec';
import { parseRenativeConfigsSync, createRnvConfig, setAppConfig } from './configTools/configParser';

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

const SDK_PLATFORMS = {};
SDK_PLATFORMS[ANDROID] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_TV] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_WEAR] = ANDROID_SDK;
SDK_PLATFORMS[TIZEN] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_WATCH] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_MOBILE] = TIZEN_SDK;
SDK_PLATFORMS[WEBOS] = WEBOS_SDK;
SDK_PLATFORMS[KAIOS] = KAIOS_SDK;

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
        if (fs.existsSync(c.paths.project.package)) {
            c.files.project.package = JSON.parse(fs.readFileSync(c.paths.project.package).toString());
        } else {
            console.log('Missing appConfigPath', c.paths.project.package);
        }
        if (fs.existsSync(c.paths.project.assets.config)) {
            c.files.appConfigFile = JSON.parse(fs.readFileSync(c.paths.project.assets.config).toString());
            c.runtime.appId = c.files.appConfigFile.id;
        } else {
            console.log('Missing runtimeConfigPath', c.paths.project.assets.config);
        }
        if (fs.existsSync(c.paths.project.config)) {
            c.files.project.config = JSON.parse(fs.readFileSync(c.paths.project.config).toString());
        } else {
            console.log('Missing projectConfigPath', c.paths.project.config);
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
    c.files.project.package = JSON.parse(fs.readFileSync(c.paths.project.package).toString());

    // Check gitignore
    checkAndCreateGitignore(c);

    // Check rn-cli-config
    logTask('configureProject:check rn-cli', chalk.grey);
    if (!fs.existsSync(c.paths.project.rnCliConfig)) {
        logWarning(
            `Looks like your rn-cli config file ${chalk.white(c.paths.project.rnCliConfig)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnv.projectTemplate.dir, RN_CLI_CONFIG_NAME), c.paths.project.rnCliConfig);
    }

    // Check babel-config
    logTask('configureProject:check babel config', chalk.grey);
    if (!fs.existsSync(c.paths.project.babelConfig)) {
        logWarning(
            `Looks like your babel config file ${chalk.white(c.paths.project.babelConfig)} is missing! Let's create one for you.`,
        );
        copyFileSync(path.join(c.paths.rnv.dir, RN_BABEL_CONFIG_NAME), c.paths.project.babelConfig);
    }

    // Check entry
    // TODO: RN bundle command fails if entry files are not at root
    // logTask('configureProject:check entry');
    // if (!fs.existsSync(c.paths.entryFolder)) {
    //     logWarning(`Looks like your entry folder ${chalk.white(c.paths.entryFolder)} is missing! Let's create one for you.`);
    //     copyFolderContentsRecursiveSync(path.join(c.paths.rnv.dir, 'entry'), c.paths.entryFolder);
    // }


    // Check rnv-config.local
    logTask('configureProject:check rnv-config.local', chalk.grey);
    if (fs.existsSync(c.paths.project.configLocal)) {
        logInfo(`Found ${RNV_PROJECT_CONFIG_LOCAL_NAME} file in your project. will use it as preference for appConfig path!`);
        c.files.project.configLocal = JSON.parse(fs.readFileSync(c.paths.project.configLocal).toString());
        if (c.files.project.configLocal.appConfigsPath) {
            if (!fs.existsSync(c.files.project.configLocal.appConfigsPath)) {
                logWarning(
                    `Looks like your custom local appConfig is pointing to ${chalk.white(
                        c.files.project.configLocal.appConfigsPath,
                    )} which doesn't exist! Make sure you create one in that location`,
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk.white(
                        c.files.project.configLocal.appConfigsPath,
                    )}. ReNativewill now swith to that location!`,
                );
                c.paths.project.appConfigsDir = c.files.project.configLocal.appConfigsPath;
            }
        } else {
            logInfo(
                `Your local config file ${chalk.white(c.paths.project.configLocal)} is missing ${chalk.white('{ appConfigsPath: "" }')} field. ${chalk.white(c.paths.project.appConfigsDir)} will be used instead`,
            );
        }
        // c.defaultAppConfigId = c.files.project.configLocal.defaultAppConfigId;
    }

    resolve();
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

const configureRnvGlobal = c => new Promise((resolve, reject) => {
    logTask('configureRnvGlobal');
    // Check globalConfigFolder
    if (fs.existsSync(c.paths.private.dir)) {
        console.log(`${c.paths.private.dir} folder exists!`);
    } else {
        console.log(`${c.paths.private.dir} folder missing! Creating one for you...`);
        mkdirSync(c.paths.private.dir);
    }

    // Check globalConfig
    if (fs.existsSync(c.paths.private.config)) {
        console.log(`${c.paths.private.dir}/${RNV_GLOBAL_CONFIG_NAME} file exists!`);
    } else {
        console.log(`${c.paths.private.dir}/${RNV_GLOBAL_CONFIG_NAME} file missing! Creating one for you...`);
        copyFileSync(path.join(c.paths.rnv.dir, 'supportFiles', 'global-config-template.json'), c.paths.private.config);
        console.log(
            `Don\'t forget to Edit: ${
                c.paths.private.dir
            }/${RNV_GLOBAL_CONFIG_NAME} with correct paths to your SDKs before continuing!`,
        );
    }

    if (fs.existsSync(c.paths.private.config)) {
        c.files.globalConfig = JSON.parse(fs.readFileSync(c.paths.private.config).toString());

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
                c.paths.project.appConfigsDir = c.files.globalConfig.appConfigsPath;
            }
        }

        const isRunningOnWindows = process.platform === 'win32';

        // Check global SDKs
        const { sdks } = c.files.globalConfig;
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
                c.cli[CLI_WEBOS_ARES] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares-package${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_INSTALL] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares-install${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_LAUNCH] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares-launch${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares-setup-device${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares-device-info${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_NOVACOM] = path.join(c.files.globalConfig.sdks.WEBOS_SDK, `CLI/bin/ares-novacom${isRunningOnWindows ? '.cmd' : ''}`);
            }
        } else {
            logWarning(`Your ${c.paths.private.config} is missing SDK configuration object`);
        }


        // Check config sanity
        if (c.files.globalConfig.defaultTargets === undefined) {
            logWarning(
                `Looks like you\'re missing defaultTargets in your config ${chalk.white(c.paths.private.config)}. Let's add them!`,
            );
            const defaultConfig = JSON.parse(
                fs.readFileSync(path.join(c.paths.rnv.dir, 'supportFiles', 'global-config-template.json')).toString(),
            );
            const newConfig = { ...c.files.globalConfig, defaultTargets: defaultConfig.defaultTargets };
            fs.writeFileSync(c.paths.private.config, JSON.stringify(newConfig, null, 2));
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
    //     copyFolderContentsRecursiveSync(path.join(c.paths.rnv.dir, 'entry'), c.paths.entryFolder);
    // }
    let plat;
    const p = c.files.appConfigFile.platforms;
    for (const k in p) {
        plat = p[k];
        const source = path.join(c.paths.projectTemplateFolder, `${plat.entryFile}.js`);
        const backupSource = path.join(c.paths.rnv.projectTemplate.dir, 'entry', `${plat.entryFile}.js`);
        const dest = path.join(c.paths.project.dir, `${plat.entryFile}.js`);
        if (!fs.existsSync(dest)) {
            if (!plat.entryFile) {
                logError(`You missing entryFile for ${chalk.white(k)} platform in your ${chalk.white(c.paths.appConfig.config)}.`);
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
    if (fs.existsSync(c.paths.project.projectConfig.plugins)) {
        c.files.pluginConfig = readObjectSync(c.paths.project.projectConfig.plugins, c);
    } else {
        logWarning(
            `Looks like your plugin config is missing from ${chalk.white(c.paths.project.projectConfig.plugins)}. let's create one for you!`,
        );
        c.files.pluginConfig = { plugins: {} };
        fs.writeFileSync(c.paths.project.projectConfig.plugins, JSON.stringify(c.files.pluginConfig, null, 2));
    }

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;
    for (const k in c.files.pluginConfig.plugins) {
        const dependencies = c.files.project.package.dependencies;
        const devDependencies = c.files.project.package.devDependencies;
        const plugin = getMergedPlugin(c, k, c.files.pluginConfig.plugins);

        if (!plugin) {
            logWarning(`Plugin with name ${
                chalk.white(k)} does not exists in ReNative source:rnv scope. you need to define it manually here: ${
                chalk.white(c.paths.project.projectConfig.plugins)}`);
        } else if (dependencies && dependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && dependencies[k] !== plugin.version) {
                if (k === 'renative' && c.runtime.isWrapper) {
                    logWarning('You\'re in ReNative wrapper mode. plugin renative will stay as local dep!');
                } else {
                    logWarning(
                        `Version mismatch of dependency ${chalk.white(k)} between:
  ${chalk.white(c.paths.project.package)}: v(${chalk.red(dependencies[k])}) and
  ${chalk.white(c.paths.project.projectConfig.plugins)}: v(${chalk.green(plugin.version)}).
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

    // Check permissions
    logTask('configureProject:check permissions', chalk.grey);
    if (fs.existsSync(c.paths.project.projectConfig.permissions)) {
        c.files.permissionsConfig = JSON.parse(fs.readFileSync(c.paths.project.projectConfig.permissions).toString());
    } else {
        const newPath = path.join(c.paths.rnv.dir, 'projectConfig/permissions.json');
        logWarning(
            `Looks like your permission config is missing from ${chalk.white(
                c.paths.project.projectConfig.permissions,
            )}. ReNative Default ${chalk.white(newPath)} will be used instead`,
        );
        c.paths.project.projectConfig.permissions = newPath;
        c.files.permissionsConfig = JSON.parse(fs.readFileSync(c.paths.project.projectConfig.permissions).toString());
    }

    resolve();
});

const configureApp = c => new Promise((resolve, reject) => {
    logTask('configureApp');

    if (c.runtime.appId) {
        // App ID specified
        _getConfig(c, c.runtime.appId)
            .then(() => {
                configureEntryPoints(c);
                resolve(c);
            })
            .catch(e => reject(e));
    } else {
        // Use latest app from platformAssets
        if (!fs.existsSync(c.paths.project.assets.config)) {
            logWarning(
                `Seems like you're missing ${
                    c.paths.project.assets.config
                } file. But don't worry. ReNative got you covered. Let's configure it for you!`,
            );

            _getConfig(c, c.defaultAppConfigId)
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
                const assetConfig = JSON.parse(fs.readFileSync(c.paths.project.assets.config).toString());
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

const getQuestion = msg => chalk.blue(`\n ❓ ${msg}: `);

const IGNORE_FOLDERS = ['.git'];

export const listAppConfigsFoldersSync = (c) => {
    const configDirs = [];
    fs.readdirSync(c.paths.project.appConfigsDir).forEach((dir) => {
        if (!IGNORE_FOLDERS.includes(dir) && fs.lstatSync(path.join(c.paths.project.appConfigsDir, dir)).isDirectory()) {
            configDirs.push(dir);
        }
    });
    return configDirs;
};

const _getConfig = (c, appConfigId) => new Promise((resolve, reject) => {
    logTask(`_getConfig:${appConfigId}`);

    setAppConfig(c, appConfigId);
    c.runtime.appId = appConfigId;

    console.log('ADDADADA', c.paths.appConfig.dir);

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
                        c.runtime.appId = c.defaultAppConfigId;
                        setAppConfig(c, c.defaultAppConfigId);
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
                    setAppConfig(c, c.defaultAppConfigId);
                    copyFolderContentsRecursiveSync(
                        path.join(c.paths.rnv.dir, 'appConfigs', c.defaultAppConfigId),
                        path.join(c.paths.appConfig.dir),
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
    logTask(`_configureConfig:${c.runtime.appId}`);
    c.files.appConfigFile = JSON.parse(fs.readFileSync(c.paths.appConfig.config).toString());

    // EXTEND CONFIG
    const merge = require('deepmerge');
    try {
        if (c.files.appConfigFile.extend) {
            const parentAppConfigFolder = path.join(c.paths.project.appConfigsDir, c.files.appConfigFile.extend);
            if (fs.existsSync(parentAppConfigFolder)) {
                const parentAppConfigPath = path.join(parentAppConfigFolder, RNV_APP_CONFIG_NAME);
                const parentAppConfigFile = JSON.parse(fs.readFileSync(parentAppConfigPath).toString());
                const mergedAppConfigFile = merge(parentAppConfigFile, c.files.appConfigFile, { arrayMerge: _arrayMergeOverride });
                c.files.appConfigFile = mergedAppConfigFile;
                setAppConfig(c, c.files.appConfigFile.extend);
            }
        }
        resolve();
    } catch (e) {
        reject(e);
    }
});

const getAppFolder = (c, platform) => path.join(c.paths.platformBuildsFolder, `${c.runtime.appId}_${platform}`);

const getAppTemplateFolder = (c, platform) => path.join(c.paths.project.platformTemplatesDirs[platform], `${platform}`);

const getAppConfigId = (c, platform) => c.files.appConfigFile.id;

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
    if (!c.files.appConfigFile) {
        logError('getConfigProp: c.files.appConfigFile is undefined!');
        return null;
    }
    const p = c.files.appConfigFile.platforms[platform];
    const ps = _getScheme(c);
    let resultPlatforms;
    let scheme;
    if (p) {
        scheme = p.buildSchemes ? p.buildSchemes[ps] : null;
        resultPlatforms = c.files.appConfigFile.platforms[platform][key];
    }


    scheme = scheme || {};
    const resultCli = CLI_PROPS.includes(key) ? c.program[key] : null;
    const resultScheme = scheme[key];
    const resultCommon = c.files.appConfigFile.common[key];

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

const getAppVersion = (c, platform) => c.files.appConfigFile.platforms[platform].version || c.files.appConfigFile.common.verion || c.files.project.package.version;

const getAppAuthor = (c, platform) => c.files.appConfigFile.platforms[platform].author || c.files.appConfigFile.common.author || c.files.project.package.author;

const getAppLicense = (c, platform) => c.files.appConfigFile.platforms[platform].license || c.files.appConfigFile.common.license || c.files.project.package.license;

const getEntryFile = (c, platform) => c.files.appConfigFile.platforms[platform].entryFile;

const getGetJsBundleFile = (c, platform) => c.files.appConfigFile.platforms[platform].getJsBundleFile || getJsBundleFileDefaults[platform];

const getAppDescription = (c, platform) => c.files.appConfigFile.platforms[platform].description || c.files.appConfigFile.common.description || c.files.project.package.description;

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
        logError(`Looks like your appConfigFile is not configured properly! check ${chalk.white(c.paths.appConfig.config)} location.`);
        if (resolve) resolve();
        return false;
    }
    if (!c.files.appConfigFile.platforms[platform]) {
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
    configureRnvGlobal
};

export default {
    SUPPORTED_PLATFORMS,
    listAppConfigsFoldersSync,
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
    configureRnvGlobal
};
