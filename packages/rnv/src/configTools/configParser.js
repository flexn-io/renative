import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import merge from 'deepmerge';
import { promisify } from 'util';
import inquirer from 'inquirer';
import {
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_PRIVATE_NAME,
    RENATIVE_CONFIG_LOCAL_NAME,
    RENATIVE_CONFIG_BUILD_NAME,
    RENATIVE_CONFIG_RUNTIME_NAME,
    RENATIVE_CONFIG_WORKSPACES_NAME,
    RENATIVE_CONFIG_PLUGINS_NAME,
    RENATIVE_CONFIG_TEMPLATES_NAME,
    RENATIVE_CONFIG_PLATFORMS_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    PLATFORMS,
    SUPPORTED_PLATFORMS
} from '../constants';

import {
    copyFolderContentsRecursiveSync,
    copyFileSync,
    mkdirSync,
    writeFileSync,
    readObjectSync,
    getRealPath,
    sanitizeDynamicRefs,
    sanitizeDynamicProps,
    mergeObjects
} from '../systemTools/fileutils';
import { getSourceExtsAsString, getConfigProp } from '../common';
import { doResolve } from '../resolve';
import { getWorkspaceDirPath } from '../projectTools/workspace';
import {
    logError,
    logTask,
    logWarning,
    logDebug,
    logInfo,
    getCurrentCommand
} from '../systemTools/logger';
import {
    copyRuntimeAssets,
    checkAndCreateProjectPackage,
    checkAndCreateProjectConfig,
    checkAndCreateGitignore,
    copySharedPlatforms,
    upgradeProjectDependencies
} from '../projectTools/projectParser';
import { inquirerPrompt } from '../systemTools/prompt';
import Config from '../config';

const base = path.resolve('.');
const homedir = require('os').homedir();

const readdirAsync = promisify(fs.readdir);

const IGNORE_FOLDERS = ['.git'];

const loadAppConfigIDfromDir = (dir, appConfigsDir) => {
    logTask(`loadAppConfigIDfromDir:${dir}:${appConfigsDir}`, chalk.grey);
    const filePath = path.join(appConfigsDir, dir, 'renative.json');
    if (fs.existsSync(filePath)) {
        try {
            const renativeConf = JSON.parse(fs.readFileSync(filePath));
            return { dir, id: renativeConf.id };
        } catch (e) {
            logError(`File ${filePath} is MALFORMED:\n${e}`);
        }
    }
    return { dir, id: null };
};

const askUserAboutConfigs = async (c, dir, id, basePath) => {
    logWarning(
        `AppConfig error - It seems you have a mismatch between appConfig folder name (${dir}) and the id defined in renative.json (${id}). They must match.`
    );
    if (c.program.ci === true) {
        throw new Error(
            'You cannot continue if you set --ci flag. please fix above error first'
        );
    }
    const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'You must choose what you want to keep',
        choices: [
            {
                name: `Keep ID from renative.json (${id}) and rename the folder (${dir} -> ${id})`,
                value: 'keepID'
            },
            {
                name: `Keep folder name (${dir}) and rename the ID from renative.json (${id} -> ${dir})`,
                value: 'keepFolder'
            },
            new inquirer.Separator(),
            {
                name: "I'll do it manually",
                value: 'manually'
            }
        ]
    });

    if (choice === 'manually') {
        throw new Error('Please do the changes and rerun the command');
    }

    if (choice === 'keepID') {
        fs.renameSync(path.join(basePath, dir), path.join(basePath, id));
    }

    if (choice === 'keepFolder') {
        const filePath = path.join(basePath, dir, 'renative.json');
        const fileContents = JSON.parse(fs.readFileSync(filePath));
        fileContents.id = dir;

        writeFileSync(filePath, fileContents);
    }
};

const matchAppConfigID = async (c, appConfigID) => {
    logTask(`matchAppConfigID:${appConfigID}`, chalk.grey);

    if (!appConfigID) return false;

    const appConfigsDirs = c.buildConfig?.paths?.appConfigsDirs || [
        c.paths.project?.appConfigsDir
    ];
    for (let i = 0; i < appConfigsDirs.length; i++) {
        const appConfigsDir = appConfigsDirs[i];

        const appConfigDirContents = await (
            await readdirAsync(appConfigsDir)
        ).filter(folder => fs.statSync(path.join(appConfigsDir, folder)).isDirectory());

        const appConfigs = appConfigDirContents
            .map(dir => loadAppConfigIDfromDir(dir, appConfigsDir))
            .filter(conf => conf.id !== null);
        // find duplicates
        const ids = [];
        const dirs = [];
        await Promise.all(
            appConfigs.map(async (conf) => {
                const id = conf.id.toLowerCase();
                const dir = conf.dir.toLowerCase();
                // find mismatches
                if (id !== dir) {
                    await askUserAboutConfigs(
                        c,
                        conf.dir,
                        conf.id,
                        appConfigsDir
                    );
                }
                if (ids.includes(id)) {
                    throw new Error(
                        `AppConfig error - You have 2 duplicate app configs with ID ${id}. Keep in mind that ID is case insensitive. Please edit one of them in /appConfigs/<folder>/renative.json`
                    );
                }
                ids.push(id);
                if (dirs.includes(dir)) {
                    throw new Error(
                        `AppConfig error - You have 2 duplicate app config folders named ${dir}. Keep in mind that folder names are case insensitive. Please rename one /appConfigs/<folder>`
                    );
                }
                dirs.push(dir);
            })
        );

        const foundConfig = appConfigs.filter(
            cfg => cfg.id === appConfigID
                || cfg.id.toLowerCase() === appConfigID
                || cfg.dir === appConfigID
                || cfg.dir.toLowerCase() === appConfigID
        );
        if (foundConfig.length) return foundConfig[0].id.toLowerCase();
    }
    return false;
};

export const checkIsRenativeProject = c => new Promise((resolve, reject) => {
    if (!c.paths.project.configExists) {
        return reject(
            `Looks like this directory is not ReNative project. Project config ${chalk.white(
                c.paths.project.config
            )} is missing!. You can create new project with ${chalk.white(
                'rnv new'
            )}`
        );
    }

    return resolve();
});

export const fixRenativeConfigsSync = async (c) => {
    logTask('fixRenativeConfigsSync');

    // Parse Project Config
    // checkAndCreateProjectPackage(c, 'renative-app', 'ReNative App');

    // Check gitignore
    checkAndCreateGitignore(c);

    // Check rn-cli-config
    logTask('configureProject:check rn-cli', chalk.grey);
    if (!fs.existsSync(c.paths.project.rnCliConfig)) {
        logInfo(
            `Looks like your rn-cli config file ${chalk.white(
                c.paths.project.rnCliConfig
            )} is missing! Let's create one for you.`
        );
        copyFileSync(
            path.join(c.paths.rnv.projectTemplate.dir, RN_CLI_CONFIG_NAME),
            c.paths.project.rnCliConfig
        );
    }

    // Check babel-config
    logTask('configureProject:check babel config', chalk.grey);
    if (!fs.existsSync(c.paths.project.babelConfig)) {
        logInfo(
            `Looks like your babel config file ${chalk.white(
                c.paths.project.babelConfig
            )} is missing! Let's create one for you.`
        );
        copyFileSync(
            path.join(c.paths.rnv.projectTemplate.dir, RN_BABEL_CONFIG_NAME),
            c.paths.project.babelConfig
        );
    }

    return true;
};

const _generateConfigPaths = (pathObj, dir) => {
    pathObj.dir = dir;
    pathObj.config = path.join(dir, RENATIVE_CONFIG_NAME);
    pathObj.configLocal = path.join(dir, RENATIVE_CONFIG_LOCAL_NAME);
    pathObj.configPrivate = path.join(dir, RENATIVE_CONFIG_PRIVATE_NAME);
};

export const versionCheck = async (c) => {
    logTask('versionCheck');

    if (c.runtime.isWrapper || c.runtime.versionCheckCompleted) {
        return true;
    }
    c.runtime.rnvVersionRunner = c.files.rnv?.package?.version;
    c.runtime.rnvVersionProject = c.files.project?.package?.devDependencies?.rnv;
    logTask(
        `versionCheck:rnvRunner:${c.runtime.rnvVersionRunner},rnvProject:${c.runtime.rnvVersionProject}`,
        chalk.grey
    );
    if (c.runtime.rnvVersionRunner && c.runtime.rnvVersionProject) {
        if (c.runtime.rnvVersionRunner !== c.runtime.rnvVersionProject) {
            const recCmd = chalk.white(`$ npx ${getCurrentCommand(true)}`);
            const actionNoUpdate = 'Continue and skip updating package.json';
            const actionWithUpdate = 'Continue and update package.json';
            const actionUpgrade = `Upgrade project to ${c.runtime.rnvVersionRunner}`;

            const { chosenAction } = await inquirerPrompt({
                message: 'What to do next?',
                type: 'list',
                name: 'chosenAction',
                choices: [actionNoUpdate, actionWithUpdate, actionUpgrade],
                warningMessage: `You are running $rnv v${chalk.red(
                    c.runtime.rnvVersionRunner
                )} against project built with rnv v${chalk.red(
                    c.runtime.rnvVersionProject
                )}. This might result in unexpected behaviour! It is recommended that you run your rnv command with npx prefix: ${recCmd} . or manually update your devDependencies.rnv version in your package.json.`
            });

            c.runtime.versionCheckCompleted = true;

            c.runtime.skipPackageUpdate = chosenAction === actionNoUpdate;

            if (chosenAction === actionUpgrade) {
                upgradeProjectDependencies(c, c.runtime.rnvVersionRunner);
            }
        }
    }
    return true;
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

const _findAndSwitchAppConfigDir = (c, appId) => {
    logTask(`_findAndSwitchAppConfigDir:${appId}`);

    c.paths.project.appConfigsDir = getRealPath(
        c,
        c.buildConfig.paths?.appConfigsDir,
        'appConfigsDir',
        c.paths.project.appConfigsDir
    );
    const appConfigsDirs = c.buildConfig.paths?.appConfigsDirs;
    if (appConfigsDirs && appConfigsDirs.forEach && appId) {
        appConfigsDirs.forEach((v) => {
            const altPath = path.join(v, appId);
            if (fs.existsSync(altPath)) {
                logInfo(
                    `Found config in following location: ${altPath}. Will use it`
                );
                c.paths.project.appConfigsDir = v;
            }
        });
    }
};

const _arrayMergeOverride = (destinationArray, sourceArray) => sourceArray;

export const generateBuildConfig = (c) => {
    logTask('generateBuildConfig');

    const mergeOrder = [
        c.paths.rnv.projectTemplates.config,
        c.paths.rnv.pluginTemplates.config,
        c.files.rnv.platformTemplates.config,
        c.paths.workspace.config,
        c.paths.workspace.configPrivate,
        c.paths.workspace.configLocal,
        c.paths.workspace.project.config,
        c.paths.workspace.project.configPrivate,
        c.paths.workspace.project.configLocal,
        c.paths.workspace.appConfig.configBase,
        c.paths.workspace.appConfig.config,
        c.paths.workspace.appConfig.configPrivate,
        c.paths.workspace.appConfig.configLocal,
        c.paths.project.config,
        c.paths.project.configPrivate,
        c.paths.project.configLocal,
        c.paths.appConfig.configBase,
        c.paths.appConfig.config,
        c.paths.appConfig.configPrivate,
        c.paths.appConfig.configLocal
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

    let pluginTemplates = [];
    if (c.files.rnv.pluginTemplates.configs) {
        pluginTemplates = Object.keys(c.files.rnv.pluginTemplates.configs).map(
            v => c.files.rnv.pluginTemplates.configs[v]
        );
    }

    const mergeFiles = [
        c.files.rnv.projectTemplates.config,
        ...pluginTemplates,
        c.files.workspace.config,
        c.files.workspace.configPrivate,
        c.files.workspace.configLocal,
        c.files.workspace.project.config,
        c.files.workspace.project.configPrivate,
        c.files.workspace.project.configLocal,
        c.files.workspace.appConfig.configBase,
        c.files.workspace.appConfig.config,
        c.files.workspace.appConfig.configPrivate,
        c.files.workspace.appConfig.configLocal,
        c.files.project.config,
        c.files.project.configPrivate,
        c.files.project.configLocal,
        c.files.appConfig.configBase,
        c.files.appConfig.config,
        c.files.appConfig.configPrivate,
        c.files.appConfig.configLocal
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

    const meta = [
        {
            _meta: {
                generated: new Date().getTime(),
                mergedConfigs: existsPaths
            }
        }
    ];
    const existsFiles = mergeFiles.filter(v => v);

    logTask(
        `generateBuildConfig:${mergeOrder.length}:${cleanPaths.length}:${existsPaths.length}:${existsFiles.length}`,
        chalk.grey
    );

    let out = merge.all([...meta, ...existsFiles], {
        arrayMerge: _arrayMergeOverride
    });
    out = merge({}, out);

    logDebug(
        `generateBuildConfig: will sanitize file at: ${c.paths.project.builds.config}`
    );
    c.buildConfig = sanitizeDynamicRefs(c, out);
    c.buildConfig = sanitizeDynamicProps(c.buildConfig, c.buildConfig._refs);

    if (fs.existsSync(c.paths.project.builds.dir)) {
        writeFileSync(c.paths.project.builds.config, c.buildConfig);
    }
    // DEPRECATED
    // if (Config.isRenativeProject) {
    //     const localMetroPath = path.join(c.paths.project.dir, 'metro.config.local.js');
    //
    //     if (c.platform) {
    //         fs.writeFileSync(localMetroPath, `module.exports = ${getSourceExtsAsString(c)}`);
    //     } else if (!fs.existsSync(localMetroPath)) {
    //         fs.writeFileSync(localMetroPath, 'module.exports = []');
    //     }
    // }
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
        pathObj.dirs = [path.join(extendDir, extendAppId), pathObj.dir];
        pathObj.fontDirs = [
            path.join(pathObj.dirs[0], 'fonts'),
            path.join(pathObj.dirs[1], 'fonts')
        ];
        pathObj.pluginDirs = [
            path.join(pathObj.dirs[0], 'plugins'),
            path.join(pathObj.dirs[1], 'plugins')
        ];
        loadFile(fileObj, pathObj, 'configBase');
    } else {
        pathObj.fontDirs = c.paths.project.projectConfig.fontsDirs;
    }

    generateBuildConfig(c);
    return result;
};

export const generateRuntimeConfig = async (c) => {
    logTask('generateRuntimeConfig');
    // c.assetConfig = {
    //     common: c.buildConfig.common,
    //     runtime: c.buildConfig.runtime
    // };
    c.assetConfig = mergeObjects(c, c.assetConfig, c.buildConfig.runtime || {});
    c.assetConfig = mergeObjects(
        c,
        c.assetConfig,
        c.buildConfig.common?.runtime || {}
    );
    c.assetConfig = mergeObjects(
        c,
        c.assetConfig,
        c.buildConfig.platforms?.[c.platform]?.runtime || {}
    );
    c.assetConfig = mergeObjects(
        c,
        c.assetConfig,
        getConfigProp(c, c.platform, 'runtime') || {}
    );

    if (fs.existsSync(c.paths.project.assets.dir)) {
        writeFileSync(c.paths.project.assets.config, c.assetConfig);
    }
    return true;
};

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
    writeFileSync(c.paths.project.configLocal, configLocal);
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
                originalPath
            );
        } else {
            result[v] = getRealPath(
                c,
                pt[v],
                'platformTemplatesDir',
                originalPath
            );
        }
    });
    return result;
};

const _listAppConfigsFoldersSync = (
    dirPath,
    configDirs,
    ignoreHiddenConfigs
) => {
    logTask(`_listAppConfigsFoldersSync:${dirPath}`, chalk.grey);
    if (!fs.existsSync(dirPath)) return;
    fs.readdirSync(dirPath).forEach((dir) => {
        const appConfigDir = path.join(dirPath, dir);
        if (
            !IGNORE_FOLDERS.includes(dir)
            && fs.lstatSync(appConfigDir).isDirectory()
        ) {
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

export const listAppConfigsFoldersSync = (c, ignoreHiddenConfigs) => {
    logTask(`listAppConfigsFoldersSync:${ignoreHiddenConfigs}`);
    const configDirs = [];
    const appConfigsDirs = c.buildConfig?.paths?.appConfigsDirs;
    if (appConfigsDirs && appConfigsDirs.forEach) {
        appConfigsDirs.forEach((v) => {
            _listAppConfigsFoldersSync(v, configDirs, ignoreHiddenConfigs);
        });
    } else {
        _listAppConfigsFoldersSync(
            c.paths.project.appConfigsDir,
            configDirs,
            ignoreHiddenConfigs
        );
    }

    return configDirs;
};

export const loadProjectTemplates = (c) => {
    c.files.rnv.projectTemplates.config = readObjectSync(
        c.paths.rnv.projectTemplates.config
    );
};

export const loadPluginTemplates = (c) => {
    logTask('loadPluginTemplates');
    c.files.rnv.pluginTemplates.config = readObjectSync(
        c.paths.rnv.pluginTemplates.config
    );

    c.files.rnv.pluginTemplates.configs = {
        rnv: c.files.rnv.pluginTemplates.config
    };

    c.paths.rnv.pluginTemplates.dirs = [c.paths.rnv.pluginTemplates.dir];

    const customPluginTemplates = c.files.project.config?.paths?.pluginTemplates;
    if (customPluginTemplates) {
        Object.keys(customPluginTemplates).forEach((k) => {
            const val = customPluginTemplates[k];
            if (val.npm) {
                const npmDep = c.files.project.package?.dependencies[val.npm]
                    || c.files.project.package?.devDependencies[val.npm];

                if (npmDep) {
                    let ptPath;
                    if (npmDep.startsWith('file:')) {
                        ptPath = path.join(
                            c.paths.project.dir,
                            npmDep.replace('file:', ''),
                            val.path || ''
                        );
                    } else {
                        // ptPath = path.join(c.paths.project.nodeModulesDir, val.npm, val.path || '');
                        ptPath = `${doResolve(val.npm)}/${val.path}`;
                    }

                    const ptConfig = path.join(
                        ptPath,
                        RENATIVE_CONFIG_PLUGINS_NAME
                    );
                    c.paths.rnv.pluginTemplates.dirs.push(ptPath);
                    if (fs.existsSync(ptConfig)) {
                        c.files.rnv.pluginTemplates.configs[k] = readObjectSync(
                            ptConfig
                        );
                    }
                }
            }
        });
    }
};

export const loadPlatformTemplates = (c) => {
    c.files.rnv.platformTemplates.config = readObjectSync(
        c.paths.rnv.platformTemplates.config
    );
};

const _loadWorkspacesSync = (c) => {
    // CHECK WORKSPACES
    if (fs.existsSync(c.paths.rnv.configWorkspaces)) {
        logDebug(`${c.paths.rnv.configWorkspaces} file exists!`);
        c.files.rnv.configWorkspaces = readObjectSync(
            c.paths.rnv.configWorkspaces
        );

        if (!c.files.rnv.configWorkspaces) c.files.rnv.configWorkspaces = {};

        if (!c.files.rnv.configWorkspaces?.workspaces) {
            c.files.rnv.configWorkspaces.workspaces = {};
        }
        if (Object.keys(c.files.rnv.configWorkspaces.workspaces).length === 0) {
            logWarning(
                `No workspace found in ${c.paths.rnv.configWorkspaces}. Creating default rnv one for you`
            );
            c.files.rnv.configWorkspaces.workspaces = {
                rnv: {
                    path: c.paths.workspace.dir
                }
            };
            writeFileSync(
                c.paths.rnv.configWorkspaces,
                c.files.rnv.configWorkspaces
            );
        }
    } else {
        logWarning(
            `Cannot find ${c.paths.rnv.configWorkspaces}. creating one..`
        );
        c.files.rnv.configWorkspaces = {
            workspaces: {
                rnv: {
                    path: c.paths.workspace.dir
                }
            }
        };
        writeFileSync(
            c.paths.rnv.configWorkspaces,
            c.files.rnv.configWorkspaces
        );
    }
};

export const setAppConfig = async (c, appId) => {
    logTask(`setAppConfig:${appId}`);

    if (!appId || appId === true || appId === true) return;

    c.runtime.appId = appId;
    c.runtime.appDir = path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${c.platform}`
    );

    _findAndSwitchAppConfigDir(c, appId);

    _generateConfigPaths(
        c.paths.appConfig,
        path.join(c.paths.project.appConfigsDir, appId)
    );
    c.paths.appConfig.fontsDir = path.join(c.paths.appConfig.dir, 'fonts');
    _loadConfigFiles(
        c,
        c.files.appConfig,
        c.paths.appConfig,
        c.paths.project.appConfigsDir
    );

    const workspaceAppConfigsDir = getRealPath(
        c,
        c.buildConfig.workspaceAppConfigsDir
    );
    c.paths.workspace.project.appConfigsDir = workspaceAppConfigsDir
        || path.join(c.paths.workspace.project.dir, 'appConfigs');

    _generateConfigPaths(
        c.paths.workspace.appConfig,
        path.join(c.paths.workspace.project.appConfigsDir, appId)
    );

    _loadConfigFiles(
        c,
        c.files.workspace.appConfig,
        c.paths.workspace.appConfig,
        c.paths.workspace.project.appConfigsDir
    );
    generateBuildConfig(c);
    generateLocalConfig(c);

    // LOAD WORKSPACE /RENATIVE.*.JSON
    _generateConfigPaths(
        c.paths.workspace,
        getRealPath(c, await getWorkspaceDirPath(c))
    );
    _loadConfigFiles(c, c.files.workspace, c.paths.workspace);
};

export const updateConfig = async (c, appConfigId) => {
    logTask(`updateConfig:${appConfigId}`);

    await setAppConfig(c, appConfigId);

    const isPureRnv = !c.command && !c.subCommand;

    if (!fs.existsSync(c.paths.appConfig.dir) || isPureRnv) {
        const configDirs = listAppConfigsFoldersSync(c, true);

        if (!appConfigId) {
            logWarning("It seems you don't have any appConfig active");
        } else if (appConfigId !== true && appConfigId !== true && !isPureRnv) {
            logWarning(
                `It seems you don't have appConfig named ${chalk.white(
                    appConfigId
                )} present in your config folder: ${chalk.white(
                    c.paths.project.appConfigsDir
                )} !`
            );
        }

        if (configDirs.length) {
            if (configDirs.length === 1) {
                // we have only one, skip the question
                logInfo(
                    `Found only one app config available. Will use ${chalk.white(
                        configDirs[0]
                    )}`
                );
                await setAppConfig(c, configDirs[0]);
                return true;
            }

            const { conf } = await inquirerPrompt({
                name: 'conf',
                type: 'list',
                message: 'Which one would you like to pick?',
                choices: configDirs,
                pageSize: 50,
                logMessage: 'ReNative found multiple existing appConfigs'
            });

            if (conf) {
                await setAppConfig(c, conf);
                return true;
            }
        }
        const { conf } = await inquirerPrompt({
            name: 'conf',
            type: 'confirm',
            message: `Do you want ReNative to create new sample appConfig (${chalk.white(
                appConfigId
            )}) for you?`,
            warningMessage: 'No app configs found for this project'
        });

        if (conf) {
            await setAppConfig(c, SAMPLE_APP_ID);
            copyFolderContentsRecursiveSync(
                path.join(c.paths.rnv.dir, 'appConfigs', SAMPLE_APP_ID),
                path.join(c.paths.appConfig.dir)
            );
            return true;
        }
    }
    return true;
};

export const parseRenativeConfigs = async (c) => {
    logTask('parseRenativeConfigs');
    // LOAD ./package.json
    loadFile(c.files.project, c.paths.project, 'package');

    // LOAD ./RENATIVE.*.JSON
    _loadConfigFiles(c, c.files.project, c.paths.project);
    if (c.program.appConfigID !== true) {
        const aid = await matchAppConfigID(
            c,
            c.program.appConfigID?.toLowerCase?.()
        );
        c.runtime.appId = aid
            || c.runtime.appId
            || c.files.project?.configLocal?._meta?.currentAppConfigId;
    }
    c.paths.project.builds.config = path.join(
        c.paths.project.builds.dir,
        `${c.runtime.appId}_${c.platform}.json`
    );

    // LOAD ./platformBuilds/RENATIVE.BUILLD.JSON
    loadFile(c.files.project.builds, c.paths.project.builds, 'config');

    // LOAD WORKSPACE /RENATIVE.*.JSON
    _generateConfigPaths(
        c.paths.workspace,
        getRealPath(c, await getWorkspaceDirPath(c))
    );
    _loadConfigFiles(c, c.files.workspace, c.paths.workspace);

    // LOAD DEFAULT WORKSPACE
    _generateConfigPaths(c.paths.defaultWorkspace, c.paths.GLOBAL_RNV_DIR);
    _loadConfigFiles(c, c.files.defaultWorkspace, c.paths.defaultWorkspace);

    // LOAD PROJECT TEMPLATES
    loadProjectTemplates(c);

    // LOAD PLUGIN TEMPLATES
    loadPluginTemplates(c);

    // LOAD PLATFORM TEMPLATES
    loadPlatformTemplates(c);

    if (!c.files.project.config) return;

    // LOAD WORKSPACE /[PROJECT_NAME]/RENATIVE.*.JSON
    _generateConfigPaths(
        c.paths.workspace.project,
        path.join(c.paths.workspace.dir, c.files.project.config.projectName)
    );
    _loadConfigFiles(c, c.files.workspace.project, c.paths.workspace.project);

    c.paths.workspace.project.projectConfig.dir = path.join(
        c.paths.workspace.project.dir,
        'projectConfig'
    );

    _findAndSwitchAppConfigDir(c);

    c.runtime.isWrapper = c.buildConfig.isWrapper;
    c.paths.project.platformTemplatesDirs = _generatePlatformTemplatePaths(c);
};

export const configureRnvGlobal = async (c) => {
    logTask('configureRnvGlobal');

    // Check globalConfig Dir
    if (fs.existsSync(c.paths.workspace.dir)) {
        logDebug(`${c.paths.workspace.dir} folder exists!`);
    } else {
        logInfo(
            `${c.paths.workspace.dir} folder missing! Creating one for you...`
        );
        mkdirSync(c.paths.workspace.dir);
    }

    // Check globalConfig
    if (fs.existsSync(c.paths.workspace.config)) {
        logDebug(
            `${c.paths.workspace.dir}/${RENATIVE_CONFIG_NAME} file exists!`
        );
    } else {
        const oldGlobalConfigPath = path.join(
            c.paths.workspace.dir,
            'config.json'
        );
        if (fs.existsSync(oldGlobalConfigPath)) {
            logWarning(
                'Found old version of your config. will copy it to new renative.json config'
            );
            copyFileSync(oldGlobalConfigPath, c.paths.workspace.config);
        } else {
            logInfo(
                `${c.paths.workspace.dir}/${RENATIVE_CONFIG_NAME} file missing! Creating one for you...`
            );
            copyFileSync(
                path.join(
                    c.paths.rnv.dir,
                    'supportFiles',
                    'global-config-template.json'
                ),
                c.paths.workspace.config
            );
        }
    }

    if (fs.existsSync(c.paths.workspace.config)) {
        c.files.workspace.config = JSON.parse(
            fs.readFileSync(c.paths.workspace.config).toString()
        );

        if (c.files.workspace.config?.appConfigsPath) {
            if (!fs.existsSync(c.files.workspace.config.appConfigsPath)) {
                logWarning(
                    `Looks like your custom global appConfig is pointing to ${chalk.white(
                        c.files.workspace.config.appConfigsPath
                    )} which doesn't exist! Make sure you create one in that location`
                );
            } else {
                logInfo(
                    `Found custom appConfing location pointing to ${chalk.white(
                        c.files.workspace.config.appConfigsPath
                    )}. ReNativewill now swith to that location!`
                );
                c.paths.project.appConfigsDir = c.files.workspace.config.appConfigsPath;
            }
        }

        // Check config sanity
        if (c.files.workspace.config.defaultTargets === undefined) {
            logWarning(
                `Looks like you\'re missing defaultTargets in your config ${chalk.white(
                    c.paths.workspace.config
                )}. Let's add them!`
            );
            const defaultConfig = JSON.parse(
                fs
                    .readFileSync(
                        path.join(
                            c.paths.rnv.dir,
                            'supportFiles',
                            'global-config-template.json'
                        )
                    )
                    .toString()
            );
            const newConfig = {
                ...c.files.workspace.config,
                defaultTargets: defaultConfig.defaultTargets
            };
            fs.writeFileSync(
                c.paths.workspace.config,
                JSON.stringify(newConfig, null, 2)
            );
        }
    }

    return true;
};

export const createRnvConfig = (program, process, cmd, subCmd) => {
    const c = {
        cli: {},
        runtime: {},
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
            global: {},
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
            },
            defaultWorkspace: {
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
            },
            defaultWorkspace: {
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
    // c.paths.rnv.nodeModulesDir = path.join(c.paths.rnv.dir, 'node_modules');
    c.paths.rnv.platformTemplates.dir = path.join(
        c.paths.rnv.dir,
        'platformTemplates'
    );
    c.paths.rnv.pluginTemplates.dir = path.join(
        c.paths.rnv.dir,
        'pluginTemplates'
    );
    c.paths.rnv.platformTemplates.config = path.join(
        c.paths.rnv.platformTemplates.dir,
        RENATIVE_CONFIG_PLATFORMS_NAME
    );
    c.paths.rnv.pluginTemplates.config = path.join(
        c.paths.rnv.pluginTemplates.dir,
        RENATIVE_CONFIG_PLUGINS_NAME
    );
    c.paths.rnv.projectTemplates.dir = path.join(
        c.paths.rnv.dir,
        'projectTemplates'
    );
    c.paths.rnv.projectTemplates.config = path.join(
        c.paths.rnv.projectTemplates.dir,
        RENATIVE_CONFIG_TEMPLATES_NAME
    );
    c.paths.rnv.package = path.join(c.paths.rnv.dir, 'package.json');

    c.paths.rnv.projectTemplate.dir = path.join(
        c.paths.rnv.dir,
        'projectTemplate'
    );
    c.files.rnv.package = JSON.parse(
        fs.readFileSync(c.paths.rnv.package).toString()
    );

    c.platform = c.program.platform;
    c.paths.home.dir = homedir;
    c.paths.GLOBAL_RNV_DIR = path.join(c.paths.home.dir, '.rnv');
    c.paths.GLOBAL_RNV_CONFIG = path.join(
        c.paths.GLOBAL_RNV_DIR,
        RENATIVE_CONFIG_NAME
    );
    c.paths.rnv.configWorkspaces = path.join(
        c.paths.GLOBAL_RNV_DIR,
        RENATIVE_CONFIG_WORKSPACES_NAME
    );

    if (!fs.existsSync(c.paths.GLOBAL_RNV_DIR)) {
        mkdirSync(c.paths.GLOBAL_RNV_DIR);
    }

    _generateConfigPaths(c.paths.project, base);

    c.paths.buildHooks.dir = path.join(c.paths.project.dir, 'buildHooks/src');
    c.paths.buildHooks.dist.dir = path.join(
        c.paths.project.dir,
        'buildHooks/dist'
    );
    c.paths.buildHooks.index = path.join(c.paths.buildHooks.dir, 'index.js');
    c.paths.buildHooks.dist.index = path.join(
        c.paths.buildHooks.dist.dir,
        'index.js'
    );
    // c.paths.project.nodeModulesDir = path.join(c.paths.project.dir, 'node_modules');
    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.appConfigsDir = path.join(
        c.paths.project.dir,
        'appConfigs'
    );
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.rnCliConfig = path.join(c.paths.project.dir, RN_CLI_CONFIG_NAME);
    c.paths.project.babelConfig = path.join(c.paths.project.dir, RN_BABEL_CONFIG_NAME);
    c.paths.project.npmLinkPolyfill = path.join(c.paths.project.dir, 'npm_link_polyfill.json');
    c.paths.project.projectConfig.dir = path.join(c.paths.project.dir, 'appConfigs', 'base');
    c.paths.project.projectConfig.pluginsDir = path.join(c.paths.project.projectConfig.dir, 'plugins');
    c.paths.project.projectConfig.fontsDir = path.join(c.paths.project.projectConfig.dir, 'fonts');
    c.paths.project.projectConfig.fontsDirs = [c.paths.project.projectConfig.fontsDir];
    c.paths.project.assets.dir = path.join(c.paths.project.dir, 'platformAssets');
    c.paths.project.assets.runtimeDir = path.join(c.paths.project.assets.dir, 'runtime');
    c.paths.project.assets.config = path.join(c.paths.project.assets.dir, RENATIVE_CONFIG_RUNTIME_NAME);
    c.paths.project.builds.dir = path.join(c.paths.project.dir, 'platformBuilds');
    c.paths.project.builds.config = path.join(c.paths.project.builds.dir, RENATIVE_CONFIG_BUILD_NAME);

    _generateConfigPaths(c.paths.workspace, c.paths.GLOBAL_RNV_DIR);

    // LOAD WORKSPACES
    try {
        _loadWorkspacesSync(c);
    } catch (e) {
        logError(e);
    }

    return c;
};
