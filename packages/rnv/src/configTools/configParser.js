import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import merge from 'deepmerge';
import inquirer from 'inquirer';
import {
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
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_DEVICE_INFO,
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_PRIVATE_NAME,
    RENATIVE_CONFIG_LOCAL_NAME,
    RENATIVE_CONFIG_BUILD_NAME,
    RENATIVE_CONFIG_RUNTIME_NAME,
    RENATIVE_CONFIG_WORKSPACES_NAME,
    RENATIVE_CONFIG_PLUGINS_NAME,
    RENATIVE_CONFIG_TEMPLATES_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    PLATFORMS,
    SUPPORTED_PLATFORMS
} from '../constants';
import {
    cleanFolder, copyFolderRecursiveSync, copyFolderContentsRecursiveSync,
    copyFileSync, mkdirSync, removeDirs, writeObjectSync, readObjectSync,
    getRealPath, sanitizeDynamicRefs, sanitizeDynamicProps, mergeObjects
} from '../systemTools/fileutils';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from '../systemTools/logger';
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
                projectTemplates: {},
                platformTemplate: {},
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
            template: {},
            appConfig: {},
            workspace: {
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
                projectTemplates: {},
                plugins: {},
                projectTemplate: {}
            },
            project: {
                projectConfig: {},
                builds: {},
                assets: {},
                platformTemplates: {}
            },
            appConfig: {},
            workspace: {
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
    c.paths.rnv.plugins.dir = path.join(c.paths.rnv.dir, 'plugins');
    c.paths.rnv.pluginTemplates.dir = path.join(c.paths.rnv.dir, 'pluginTemplates');
    c.paths.rnv.pluginTemplates.config = path.join(c.paths.rnv.pluginTemplates.dir, RENATIVE_CONFIG_PLUGINS_NAME);
    c.paths.rnv.projectTemplates.dir = path.join(c.paths.rnv.dir, 'projectTemplates');
    c.paths.rnv.projectTemplates.config = path.join(c.paths.rnv.projectTemplates.dir, RENATIVE_CONFIG_TEMPLATES_NAME);
    c.paths.rnv.package = path.join(c.paths.rnv.dir, 'package.json');
    c.paths.rnv.package = path.join(c.paths.rnv.dir, 'package.json');

    c.paths.rnv.projectTemplate.dir = path.join(c.paths.rnv.dir, 'projectTemplate');
    c.files.rnv.package = JSON.parse(fs.readFileSync(c.paths.rnv.package).toString());

    c.platform = c.program.platform;
    c.runtime.platform = c.platform;
    c.paths.home.dir = homedir;
    c.paths.GLOBAL_RNV_DIR = path.join(c.paths.home.dir, '.rnv');
    c.paths.GLOBAL_RNV_CONFIG = path.join(c.paths.GLOBAL_RNV_DIR, RENATIVE_CONFIG_NAME);
    c.paths.GLOBAL_RNV_CONFIG_WORKSPACES = path.join(c.paths.GLOBAL_RNV_DIR, RENATIVE_CONFIG_WORKSPACES_NAME);

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
    c.paths.project.assets.runtimeDir = path.join(c.paths.project.assets.dir, 'runtime');
    c.paths.project.assets.config = path.join(c.paths.project.assets.dir, RENATIVE_CONFIG_RUNTIME_NAME);
    c.paths.project.builds.dir = path.join(c.paths.project.dir, 'platformBuilds');
    c.paths.project.builds.config = path.join(c.paths.project.builds.dir, RENATIVE_CONFIG_BUILD_NAME);

    _generateConfigPaths(c.paths.workspace, c.paths.GLOBAL_RNV_DIR);

    // LOAD WORKSPACES
    _loadWorkspacesSync(c);

    return c;
};

export const parseRenativeConfigs = c => new Promise((resolve, reject) => {
    logTask('parseRenativeConfigs');
    try {
        // LOAD ./platformBuilds/RENATIVE.BUILLD.JSON
        loadFile(c.files.project.builds, c.paths.project.builds, 'config');

        // LOAD ./package.json
        loadFile(c.files.project, c.paths.project, 'package');

        // LOAD ./RENATIVE.*.JSON
        _loadConfigFiles(c, c.files.project, c.paths.project);
        c.runtime.appId = c.program.appConfigID || c.files.project?.configLocal?._meta?.currentAppConfigId;

        // LOAD WORKSPACE /RENATIVE.*.JSON
        _generateConfigPaths(c.paths.workspace, getRealPath(c, _getWorkspaceDirPath(c)));
        _loadConfigFiles(c, c.files.workspace, c.paths.workspace);

        // LOAD PROJECT TEMPLATES
        loadProjectTemplates(c);

        // LOAD PLUGIN TEMPLATES
        loadPluginTemplates(c);

        if (!c.files.project.config) return resolve();

        // LOAD WORKSPACE /[PROJECT_NAME]/RENATIVE.*.JSON
        _generateConfigPaths(c.paths.workspace.project, path.join(c.paths.workspace.dir, c.files.project.config.projectName));
        _loadConfigFiles(c, c.files.workspace.project, c.paths.workspace.project);


        c.paths.workspace.project.projectConfig.dir = path.join(c.paths.workspace.project.dir, 'projectConfig');


        _findAndSwitchAppConfigDir(c);

        c.runtime.isWrapper = c.buildConfig.isWrapper;

        c.paths.project.platformTemplatesDirs = _generatePlatformTemplatePaths(c);
    } catch (e) {
        console.log(e);
        reject(e);
        return;
    }

    resolve();
});

const _getWorkspaceDirPath = (c) => {
    const wss = c.files.configWorkspaces;
    const ws = c.runtime.selectedWorkspace || c.buildConfig?.workspaceID;

    let dirPath;
    if (wss?.workspaces && ws) {
        dirPath = wss.workspaces[ws]?.path;
    }
    if (!dirPath) {
        return c.buildConfig?.paths?.globalConfigDir || c.paths.GLOBAL_RNV_DIR;
    }
    return dirPath;
};

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

export const versionCheck = async (c) => {
    logTask('versionCheck');

    if (c.runtime.isWrapper) {
        return true;
    }
    c.runtime.rnvVersionRunner = c.files.rnv?.package?.version;
    c.runtime.rnvVersionProject = c.files.project?.package?.devDependencies?.rnv;
    logTask(`versionCheck:rnvRunner:${c.runtime.rnvVersionRunner},rnvProject:${c.runtime.rnvVersionProject}`, chalk.grey);
    if (c.runtime.rnvVersionRunner && c.runtime.rnvVersionProject) {
        if (c.runtime.rnvVersionRunner !== c.runtime.rnvVersionProject) {
            const recCmd = chalk.white(`$ npx ${getCurrentCommand(true)}`);

            const { confirm } = await inquirer.prompt({
                message: `You are running $rnv v${chalk.red(c.runtime.rnvVersionRunner)} against project built with rnv v${chalk.red(c.runtime.rnvVersionProject)}. This might result in unexpected behaviour! It is recommended that you run your rnv command with npx prefix: ${recCmd} . or manually update your devDependencies.rnv version in your package.json`,
                type: 'confirm',
                name: 'confirm',
            });

            if (!confirm) return Promise.reject('Action canceled');
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
        logError(`loadFile: ${pathObj[key]} :: ${e}`, true); // crash if there's an error in the config file
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


    generateBuildConfig(c);
    return result;
};


export const setAppConfig = (c, appId) => {
    logTask(`setAppConfig:${appId}`);

    if (!appId || appId === '?') return;

    c.runtime.appId = appId;
    c.runtime.appDir = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.runtime.platform}`);

    _findAndSwitchAppConfigDir(c, appId);

    _generateConfigPaths(c.paths.appConfig, path.join(c.paths.project.appConfigsDir, appId));
    _loadConfigFiles(c, c.files.appConfig, c.paths.appConfig, c.paths.project.appConfigsDir);

    const workspaceAppConfigsDir = getRealPath(c, c.buildConfig.workspaceAppConfigsDir);
    c.paths.workspace.project.appConfigsDir = workspaceAppConfigsDir || path.join(c.paths.workspace.project.dir, 'appConfigs');

    _generateConfigPaths(c.paths.workspace.appConfig, path.join(c.paths.workspace.project.appConfigsDir, appId));

    _loadConfigFiles(c, c.files.workspace.appConfig, c.paths.workspace.appConfig, c.paths.workspace.project.appConfigsDir);
    generateBuildConfig(c);
    generateLocalConfig(c);
};

const _findAndSwitchAppConfigDir = (c, appId) => {
    logTask(`_findAndSwitchAppConfigDir:${appId}`);

    c.paths.project.appConfigsDir = getRealPath(c, c.buildConfig.paths?.appConfigsDir, 'appConfigsDir', c.paths.project.appConfigsDir);
    if (c.buildConfig.paths?.appConfigsDirs && appId) {
        c.buildConfig.paths.appConfigsDirs.forEach((v) => {
            const altPath = path.join(v, appId);
            if (fs.existsSync(altPath)) {
                logInfo(`Found config in following location: ${altPath}. Will use it`);
                c.paths.project.appConfigsDir = v;
            }
        });
    }
};

const _arrayMergeOverride = (destinationArray, sourceArray, mergeOptions) => sourceArray;

export const generateBuildConfig = (c) => {
    logTask('generateBuildConfig');

    const mergeOrder = [
        c.paths.rnv.projectTemplates.config,
        c.paths.rnv.pluginTemplates.config,
        c.paths.workspace.config,
        c.paths.project.config,
        c.paths.project.configPrivate,
        c.paths.project.configLocal,
        c.paths.workspace.project.config,
        c.paths.workspace.project.configPrivate,
        c.paths.workspace.project.configLocal,
        c.paths.appConfig.configBase,
        c.paths.appConfig.config,
        c.paths.appConfig.configPrivate,
        c.paths.appConfig.configLocal,
        c.paths.workspace.appConfig.configBase,
        c.paths.workspace.appConfig.config,
        c.paths.workspace.appConfig.configPrivate,
        c.paths.workspace.appConfig.configLocal
    ];
    const cleanPaths = mergeOrder.filter(v => v);
    const existsPaths = cleanPaths.filter((v) => {
        const exists = fs.existsSync(v);
        if (exists) {
            logDebug(`Merged: ${v}`);
            // console.log(chalk.green(v));
        } else {
            // console.log(chalk.red(v));
        }
        return exists;
    });

    const mergeFiles = [
        c.files.rnv.projectTemplates.config,
        c.files.rnv.pluginTemplates.config,
        c.files.workspace.config,
        c.files.project.config,
        c.files.project.configPrivate,
        c.files.project.configLocal,
        c.files.workspace.project.config,
        c.files.workspace.project.configPrivate,
        c.files.workspace.project.configLocal,
        c.files.appConfig.configBase,
        c.files.appConfig.config,
        c.files.appConfig.configPrivate,
        c.files.appConfig.configLocal,
        c.files.workspace.appConfig.configBase,
        c.files.workspace.appConfig.config,
        c.files.workspace.appConfig.configPrivate,
        c.files.workspace.appConfig.configLocal
    ];

    const mergeFolders = [
        // platform templates
        c.paths.rnv.platformTemplate.dir,
        c.paths.project.projectConfig.buildsDir,
        c.paths.workspace.project.projectConfig.buildsDir,
        // ...c.paths.project.appConfigs.dirs,
        c.paths.appConfig.buildsDir,
        c.paths.workspace.appConfig.buildsDir
        // PROJECT PLUGINS?
        // PROJECT ASSETS?
        // PROJECT FONTS?
        // APP CONFIG PLUGINS?
        // APP CONFIG ASSETS?
        // APP CONFIG FONTS?
    ];

    logDebug('mergeFolders:', mergeFolders);

    const meta = [{
        _meta: {
            generated: (new Date()).getTime(),
            mergedConfigs: existsPaths
        }
    }];

    const existsFiles = mergeFiles.filter((v, i) => v);

    logTask(`generateBuildConfig:${mergeOrder.length}:${cleanPaths.length}:${existsPaths.length}:${existsFiles.length}`, chalk.grey);

    let out = merge.all([...meta, ...existsFiles], { arrayMerge: _arrayMergeOverride });
    out = merge({}, out);
    logDebug(`generateBuildConfig: will sanitize file at: ${c.paths.project.builds.config}`);
    c.buildConfig = sanitizeDynamicRefs(c, out);
    c.buildConfig = sanitizeDynamicProps(c.buildConfig, c.buildConfig._refs);
    if (fs.existsSync(c.paths.project.builds.dir)) {
        writeObjectSync(c.paths.project.builds.config, c.buildConfig);
    }
};

export const generateRuntimeConfig = c => new Promise((resolve, reject) => {
    logTask('generateRuntimeConfig');
    c.assetConfig = {
        common: c.buildConfig.common,
        runtime: c.buildConfig.runtime
    };

    if (fs.existsSync(c.paths.project.assets.dir)) {
        writeObjectSync(c.paths.project.assets.config, c.assetConfig);
    }
    resolve();
});

export const generateLocalConfig = (c, resetAppId) => {
    logTask(`generateLocalConfig:${resetAppId}:${c.paths.project.configLocal}`);
    const configLocal = c.files.project.configLocal || {};
    configLocal._meta = configLocal._meta || {};
    if (resetAppId) {
        delete configLocal._meta.currentAppConfigId;
    } else {
        configLocal._meta.currentAppConfigId = c.runtime.appId;
    }
    c.files.project.configLocal = configLocal;
    writeObjectSync(c.paths.project.configLocal, configLocal);
};

const _generatePlatformTemplatePaths = (c) => {
    const pt = c.buildConfig.platformTemplatesDirs || {};
    const originalPath = c.buildConfig.platformTemplatesDir || '$RNV_HOME/platformTemplates';
    const result = {};
    SUPPORTED_PLATFORMS.forEach((v) => {
        if (!pt[v]) {
            result[v] = getRealPath(
                c,
                originalPath,
                'platformTemplatesDir',
                originalPath,
            );
        } else {
            result[v] = getRealPath(
                c,
                pt[v],
                'platformTemplatesDir',
                originalPath,
            );
        }
    });
    return result;
};

export const updateConfig = async (c, appConfigId) => {
    logTask(`updateConfig:${appConfigId}`);

    setAppConfig(c, appConfigId);

    if (!fs.existsSync(c.paths.appConfig.dir)) {
        const configDirs = listAppConfigsFoldersSync(c, true);

        if (!appConfigId) {
            logWarning(
                'It seems you don\'t have any appConfig active',
            );
        } else if (appConfigId !== '?') {
            logWarning(
                `It seems you don't have appConfig named ${chalk.white(appConfigId)} present in your config folder: ${chalk.white(
                    c.paths.project.appConfigsDir,
                )} !`,
            );
        }

        if (configDirs.length) {
            const { conf } = await inquirer.prompt({
                name: 'conf',
                type: 'list',
                message: 'ReNative found existing appConfigs. Which one would you like to pick?',
                choices: configDirs,
                pageSize: 50
            });

            if (conf) {
                setAppConfig(c, conf);
                return true;
            }
        }
        const { conf } = await inquirer.prompt({
            name: 'conf',
            type: 'confirm',
            message: `Do you want ReNative to create new sample appConfig (${chalk.white(
                appConfigId,
            )}) for you?`,
        });

        if (conf) {
            setAppConfig(c, SAMPLE_APP_ID);
            copyFolderContentsRecursiveSync(
                path.join(c.paths.rnv.dir, 'appConfigs', SAMPLE_APP_ID),
                path.join(c.paths.appConfig.dir),
            );
            return true;
        }
    }
    return true;
};

export const listAppConfigsFoldersSync = (c, ignoreHiddenConfigs) => {
    logTask(`listAppConfigsFoldersSync:${ignoreHiddenConfigs}`);
    const configDirs = [];
    if (c.buildConfig?.paths?.appConfigsDirs) {
        c.buildConfig.paths.appConfigsDirs.forEach((v) => {
            _listAppConfigsFoldersSync(v, configDirs, ignoreHiddenConfigs);
        });
    } else {
        _listAppConfigsFoldersSync(c.paths.project.appConfigsDir, configDirs, ignoreHiddenConfigs);
    }

    return configDirs;
};

const _listAppConfigsFoldersSync = (dirPath, configDirs, ignoreHiddenConfigs) => {
    if (!fs.existsSync(dirPath)) return;
    fs.readdirSync(dirPath).forEach((dir) => {
        const appConfigDir = path.join(dirPath, dir);
        if (!IGNORE_FOLDERS.includes(dir) && fs.lstatSync(appConfigDir).isDirectory()) {
            if (ignoreHiddenConfigs) {
                const appConfig = path.join(appConfigDir, RENATIVE_CONFIG_NAME);
                if (fs.existsSync(appConfig)) {
                    try {
                        const config = readObjectSync(appConfig);
                        if (config?.hidden !== true) {
                            configDirs.push(dir);
                        }
                    } catch (e) {
                        logWarning(`_listAppConfigsFoldersSync: ${e}`);
                    }
                }
            } else {
                configDirs.push(dir);
            }
        }
    });
};

export const loadProjectTemplates = (c) => {
    c.files.rnv.projectTemplates.config = readObjectSync(c.paths.rnv.projectTemplates.config);
};

export const loadPluginTemplates = (c) => {
    c.files.rnv.pluginTemplates.config = readObjectSync(c.paths.rnv.pluginTemplates.config);
};

const _loadWorkspacesSync = (c) => {
    // CHECK WORKSPACES
    if (fs.existsSync(c.paths.GLOBAL_RNV_CONFIG_WORKSPACES)) {
        logDebug(`${c.paths.GLOBAL_RNV_CONFIG_WORKSPACES} file exists!`);
        c.files.configWorkspaces = readObjectSync(c.paths.GLOBAL_RNV_CONFIG_WORKSPACES);
    } else {
        logWarning(`Cannot find ${c.paths.GLOBAL_RNV_CONFIG_WORKSPACES}. creating one..`);
        c.files.configWorkspaces = {
            workspaces: {
                rnv: {
                    path: c.paths.workspace.dir
                }
            }
        };
        writeObjectSync(c.paths.GLOBAL_RNV_CONFIG_WORKSPACES, c.files.configWorkspaces);
    }
};

export const configureRnvGlobal = c => new Promise((resolve, reject) => {
    logTask('configureRnvGlobal');


    // Check globalConfig Dir
    if (fs.existsSync(c.paths.workspace.dir)) {
        logDebug(`${c.paths.workspace.dir} folder exists!`);
    } else {
        console.log(`${c.paths.workspace.dir} folder missing! Creating one for you...`);
        mkdirSync(c.paths.workspace.dir);
    }

    // Check globalConfig
    if (fs.existsSync(c.paths.workspace.config)) {
        logDebug(`${c.paths.workspace.dir}/${RENATIVE_CONFIG_NAME} file exists!`);
    } else {
        const oldGlobalConfigPath = path.join(c.paths.workspace.dir, 'config.json');
        if (fs.existsSync(oldGlobalConfigPath)) {
            logWarning('Found old version of your config. will copy it to new renative.json config');
            copyFileSync(oldGlobalConfigPath, c.paths.workspace.config);
        } else {
            console.log(`${c.paths.workspace.dir}/${RENATIVE_CONFIG_NAME} file missing! Creating one for you...`);
            copyFileSync(path.join(c.paths.rnv.dir, 'supportFiles', 'global-config-template.json'), c.paths.workspace.config);
            console.log(
                `Don\'t forget to Edit: ${
                    c.paths.workspace.dir
                }/${RENATIVE_CONFIG_NAME} with correct paths to your SDKs before continuing!`,
            );
        }
    }

    if (fs.existsSync(c.paths.workspace.config)) {
        c.files.workspace.config = JSON.parse(fs.readFileSync(c.paths.workspace.config).toString());

        if (c.files.workspace.config?.appConfigsPath) {
            if (!fs.existsSync(c.files.workspace.config.appConfigsPath)) {
                logWarning(
                    `Looks like your custom global appConfig is pointing to ${chalk.white(
                        c.files.workspace.config.appConfigsPath,
                    )} which doesn't exist! Make sure you create one in that location`,
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk.white(
                        c.files.workspace.config.appConfigsPath,
                    )}. ReNativewill now swith to that location!`,
                );
                c.paths.project.appConfigsDir = c.files.workspace.config.appConfigsPath;
            }
        }

        const isRunningOnWindows = process.platform === 'win32';

        // Check global SDKs
        const { sdks } = c.files.workspace.config;
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
                c.cli[CLI_WEBOS_ARES] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-package${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_INSTALL] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-install${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_LAUNCH] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-launch${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_SETUP_DEVICE] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-setup-device${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_DEVICE_INFO] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-device-info${isRunningOnWindows ? '.cmd' : ''}`);
                c.cli[CLI_WEBOS_ARES_NOVACOM] = path.join(c.files.workspace.config.sdks.WEBOS_SDK, `CLI/bin/ares-novacom${isRunningOnWindows ? '.cmd' : ''}`);
            }
        } else {
            logWarning(`Your ${c.paths.workspace.config} is missing SDK configuration object`);
        }


        // Check config sanity
        if (c.files.workspace.config.defaultTargets === undefined) {
            logWarning(
                `Looks like you\'re missing defaultTargets in your config ${chalk.white(c.paths.workspace.config)}. Let's add them!`,
            );
            const defaultConfig = JSON.parse(
                fs.readFileSync(path.join(c.paths.rnv.dir, 'supportFiles', 'global-config-template.json')).toString(),
            );
            const newConfig = { ...c.files.workspace.config, defaultTargets: defaultConfig.defaultTargets };
            fs.writeFileSync(c.paths.workspace.config, JSON.stringify(newConfig, null, 2));
        }
    }

    resolve();
});
