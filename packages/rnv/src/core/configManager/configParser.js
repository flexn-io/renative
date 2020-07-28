/* eslint-disable import/no-cycle */
import path from 'path';
import merge from 'deepmerge';
import {
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_PRIVATE_NAME,
    RENATIVE_CONFIG_LOCAL_NAME,
    RENATIVE_CONFIG_RUNTIME_NAME,
    RENATIVE_CONFIG_WORKSPACES_NAME,
    RENATIVE_CONFIG_PLUGINS_NAME,
    RENATIVE_CONFIG_TEMPLATES_NAME,
    RENATIVE_CONFIG_ENGINES_NAME,
    RN_CLI_CONFIG_NAME,
    RN_BABEL_CONFIG_NAME,
    PLATFORMS,
    USER_HOME_DIR,
    RNV_HOME_DIR,
    CURRENT_DIR,
    INJECTABLE_RUNTIME_PROPS,
    WEB_HOSTED_PLATFORMS
} from '../constants';
import { getEngineByPlatform } from '../engineManager';
import { isSystemWin } from '../utils';
import {
    copyFileSync,
    mkdirSync,
    writeFileSync,
    readObjectSync,
    getRealPath,
    sanitizeDynamicRefs,
    sanitizeDynamicProps,
    mergeObjects,
    fsExistsSync,
    fsReadFileSync,
    fsReaddirSync,
    fsLstatSync
} from '../systemManager/fileutils';
import { getConfigProp } from '../common';

import { getWorkspaceDirPath } from '../projectManager/workspace';
import {
    chalk,
    logError,
    logTask,
    logWarning,
    logDebug,
    logInfo,
    getCurrentCommand
} from '../systemManager/logger';
import {
    checkAndCreateGitignore,
    upgradeProjectDependencies
} from '../projectManager/projectParser';
import { inquirerPrompt } from '../../cli/prompt';
import { loadPluginTemplates } from '../pluginManager';

const IGNORE_FOLDERS = ['.git'];


export const configureRuntimeDefaults = async (c) => {
    c.runtime.appId = c.files.project?.configLocal?._meta?.currentAppConfigId || null;

    logTask('configureRuntimeDefaults', `appId:${c.runtime.appId}`);

    c.runtime.port = c.program.port
  || c.buildConfig?.defaults?.ports?.[c.platform]
  || PLATFORMS[c.platform]?.defaultPort;
    if (c.program.target !== true) {
        c.runtime.target = c.program.target
      || c.files.workspace.config?.defaultTargets?.[c.platform];
    } else c.runtime.target = c.program.target;
    c.runtime.scheme = c.program.scheme || 'debug';
    c.runtime.localhost = isSystemWin ? '127.0.0.1' : '0.0.0.0';
    c.runtime.timestamp = c.runtime.timestamp || Date.now();
    // c.runtime.engine = getEngineByPlatform(c, c.platform);

    c.configPropsInjects = c.configPropsInjects || [];
    c.systemPropsInjects = c.systemPropsInjects || [];
    c.runtimePropsInjects = [];

    INJECTABLE_RUNTIME_PROPS.forEach((key) => {
        c.runtimePropsInjects.push({
            pattern: `{{runtimeProps.${key}}}`,
            override: c.runtime[key]
        });
    });
    if (c.buildConfig) {
        c.runtime.scheme.bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
        const { hosted } = c.program;
        c.runtime.hosted = (hosted || !c.runtime.scheme.bundleAssets) && WEB_HOSTED_PLATFORMS.includes(c.platform);

        c.runtime.supportedPlatforms = c.buildConfig.defaults.supportedPlatforms

            .map((platform) => {
                const engine = getEngineByPlatform(c, platform);
                const dir = engine?.paths?.platformTemplatesDir;
                let isConnected = false;
                let isValid = false;
                const pDir = c.paths.project.platformTemplatesDirs?.[platform];
                if (pDir) {
                    isValid = true;
                    isConnected = pDir?.includes?.(getRealPath(c, dir));
                }
                return {
                    engine,
                    platform,
                    isConnected,
                    isValid
                };
            });
    }
};

export const checkIsRenativeProject = c => new Promise((resolve, reject) => {
    if (!c.paths.project.configExists) {
        return reject(
            `Looks like this directory is not ReNative project. Project config ${chalk().white(
                c.paths.project.config
            )} is missing!. You can create new project with ${chalk().white(
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

    // Check babel-config
    logDebug('configureProject:check babel config');
    if (!fsExistsSync(c.paths.project.babelConfig)) {
        logInfo(
            `Looks like your babel config file ${chalk().white(
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
        `versionCheck:rnvRunner:${c.runtime.rnvVersionRunner},rnvProject:${
            c.runtime.rnvVersionProject
        }`,
        chalk().grey
    );
    if (c.runtime.rnvVersionRunner && c.runtime.rnvVersionProject) {
        if (c.runtime.rnvVersionRunner !== c.runtime.rnvVersionProject) {
            const recCmd = chalk().white(`$ npx ${getCurrentCommand(true)}`);
            const actionNoUpdate = 'Continue and skip updating package.json';
            const actionWithUpdate = 'Continue and update package.json';
            const actionUpgrade = `Upgrade project to ${
                c.runtime.rnvVersionRunner
            }`;

            const { chosenAction } = await inquirerPrompt({
                message: 'What to do next?',
                type: 'list',
                name: 'chosenAction',
                choices: [actionNoUpdate, actionWithUpdate, actionUpgrade],
                warningMessage: `You are running $rnv v${chalk().red(
                    c.runtime.rnvVersionRunner
                )} against project built with rnv v${chalk().red(
                    c.runtime.rnvVersionProject
                )}. This might result in unexpected behaviour!
It is recommended that you run your rnv command with npx prefix: ${
    recCmd
} . or manually update your devDependencies.rnv version in your package.json.`
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
    const pKey = `${key}Exists`;
    if (!fsExistsSync(pathObj[key])) {
        pathObj[pKey] = false;
        logDebug(`WARNING: loadFile: Path ${pathObj[key]} does not exists!`);
        logDebug(`FILE_EXISTS: ${key}:false path:${pathObj[key]}`);
        return false;
    }
    pathObj[pKey] = true;
    try {
        const fileString = fsReadFileSync(pathObj[key]).toString();
        fileObj[key] = JSON.parse(fileString);
        pathObj[pKey] = true;
        logDebug(`FILE_EXISTS: ${key}:true size:${_formatBytes(Buffer.byteLength(fileString, 'utf8'))}`);
        return true;
    } catch (e) {
        logError(`loadFile: ${pathObj[key]} :: ${e}`, true); // crash if there's an error in the config file
        return false;
    }
};

const _arrayMergeOverride = (destinationArray, sourceArray) => sourceArray;


const getEnginesPluginDelta = (c) => {
    logDebug('getEnginesPluginDelta');

    if (!c.buildConfig) return;


    const enginePlugins = {};
    const missingEnginePlugins = {};
    // const supPlats = c.files.project?.config?.defaults?.supportedPlatforms;
    // if (supPlats) {
    //     supPlats.forEach((pk) => {
    //         const selectedEngine = getEngineByPlatform(c, pk, true);
    //         if (selectedEngine?.plugins) {
    //             const ePlugins = Object.keys(selectedEngine.plugins);
    //
    //             if (ePlugins?.length) {
    //                 ePlugins.forEach((pluginKey) => {
    //                     if (!c.files?.project?.config?.[pluginKey]) {
    //                         missingEnginePlugins[pluginKey] = selectedEngine.plugins[pluginKey];
    //                     }
    //                     enginePlugins[pluginKey] = selectedEngine.plugins[pluginKey];
    //                 });
    //             }
    //         }
    //     });
    // }
    const selectedEngine = getEngineByPlatform(c, c.platform, true);
    if (selectedEngine?.plugins) {
        const ePlugins = Object.keys(selectedEngine.plugins);

        if (ePlugins?.length) {
            ePlugins.forEach((pluginKey) => {
                if (!c.files?.project?.config?.[pluginKey]) {
                    missingEnginePlugins[pluginKey] = selectedEngine.plugins[pluginKey];
                }
                enginePlugins[pluginKey] = selectedEngine.plugins[pluginKey];
            });
        }
    }
    c.runtime.missingEnginePlugins = missingEnginePlugins;
    return enginePlugins;
};

export const writeRenativeConfigFile = (c, configPath, configData) => {
    logDebug(`writeRenativeConfigFile:${configPath}`);
    writeFileSync(configPath, configData);
    generateBuildConfig(c);
};

const _formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

export const generateBuildConfig = (c) => {
    logDebug('generateBuildConfig');

    const mergeOrder = [
        c.paths.defaultWorkspace.config,
        c.paths.rnv.projectTemplates.config,
        c.paths.rnv.pluginTemplates.config,
        // c.paths.rnv.platformTemplates.config,
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
        const exists = fsExistsSync(v);
        if (exists) {
            logDebug(`Merged: ${v}`);
            // console.log(chalk().green(v));
        } else {
            // console.log(chalk().red(v));
        }
        return exists;
    });

    const pluginTemplates = {};
    if (c.files.rnv.pluginTemplates.configs) {
        Object.keys(c.files.rnv.pluginTemplates.configs).forEach((v) => {
            const plgs = c.files.rnv.pluginTemplates.configs[v];
            pluginTemplates[v] = plgs.pluginTemplates;
        });
    }

    const extraPlugins = getEnginesPluginDelta(c);

    const mergeFiles = [
        c.files.defaultWorkspace.config,
        c.files.rnv.projectTemplates.config,
        { plugins: extraPlugins },
        // { pluginTemplates },
        c.files.rnv.engines.config,
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

    // mergeFiles.forEach((mergeFile, i) => {
    //     console.log(`MERGEDIAGNOSTICS ${i}`, Object.keys(mergeFile?.plugins || {}));
    // });

    const meta = [
        {
            _meta: {
                generated: new Date().getTime(),
                mergedConfigs: existsPaths
            }
        }
    ];
    const existsFiles = mergeFiles.filter(v => v);

    logDebug(
        `generateBuildConfig:mergeOrder.length:${
            mergeOrder.length
        },cleanPaths.length:${cleanPaths.length},existsPaths.length:${
            existsPaths.length
        },existsFiles.length:${existsFiles.length}`
    );

    let out = merge.all([...meta, ...existsFiles], {
        arrayMerge: _arrayMergeOverride
    });
    out = merge({}, out);
    out.pluginTemplates = pluginTemplates;

    c.buildConfig = sanitizeDynamicRefs(c, out);
    c.buildConfig = sanitizeDynamicProps(c.buildConfig, c.buildConfig._refs, {}, c.runtime);

    logDebug('BUILD_CONFIG', Object.keys(c.buildConfig));

    if (c.runtime.appId) {
        c.paths.project.builds.config = path.join(
            c.paths.project.builds.dir,
            `${c.runtime.appId}_${c.platform}.json`
        );

        logDebug(
            `generateBuildConfig: will sanitize file at: ${
                c.paths.project.builds.config
            }`
        );

        if (c.paths.project.builds.dir) {
            const result = writeFileSync(c.paths.project.builds.config, c.buildConfig);
            if (result) {
                const size = _formatBytes(Buffer.byteLength(result || '', 'utf8'));
                logTask(chalk().grey('generateBuildConfig'), `size:${size}`);
            } else {
                logDebug(`generateBuildConfig NOT SAVED: ${c.paths.project.builds.config}`);
            }
        } else {
            logWarning('Cannot save buildConfig as c.paths.project.builds.dir is not defined');
        }
    }


    // DEPRECATED
    // if (Config.isRenativeProject) {
    //     const localMetroPath = path.join(c.paths.project.dir, 'metro.config.local.js');
    //
    //     if (c.platform) {
    //         fsWriteFileSync(localMetroPath, `module.exports = ${getSourceExtsAsString(c)}`);
    //     } else if (!fsExistsSync(localMetroPath)) {
    //         fsWriteFileSync(localMetroPath, 'module.exports = []');
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

    if (fsExistsSync(c.paths.project.assets.dir)) {
        writeFileSync(c.paths.project.assets.config, c.assetConfig);
    }
    return true;
};

export const generateLocalConfig = (c, resetAppId) => {
    logTask('generateLocalConfig', `resetAppId:${!!resetAppId}`);
    const configLocal = c.files.project.configLocal || {};
    // configLocal.kokot = 'fooo';
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
    logTask('_generatePlatformTemplatePaths');
    if (!c.buildConfig.paths) {
        logWarning(`You're missing paths object in your ${chalk().white(c.paths.project.config)}`);
        c.buildConfig.paths = {};
    }
    if (c.buildConfig.platformTemplatesDirs || c.buildConfig.platformTemplatesDir
      || c.buildConfig.paths.platformTemplatesDir) {
        logWarning(`DEPRECATED: platformTemplatesDirs in ${
            chalk().white(c.paths.project.config)} has been moved to engine config`);
    }
    const pt = c.buildConfig.paths.platformTemplatesDirs || c.buildConfig.platformTemplatesDirs || {};
    const result = {};

    c.buildConfig.defaults.supportedPlatforms.forEach((platform) => {
        const engine = getEngineByPlatform(c, platform);
        const originalPath = engine?.paths?.platformTemplatesDir;
        if (originalPath) {
            if (!pt[platform]) {
                result[platform] = getRealPath(
                    c,
                    originalPath,
                    'platformTemplatesDir',
                    originalPath
                );
            } else {
                result[platform] = getRealPath(
                    c,
                    pt[platform],
                    'platformTemplatesDir',
                    originalPath
                );
            }
        } else {
            logWarning(`Platform ${chalk().red(platform)} not supported by any registered engine. SKIPPING...`);
        }
    });


    // c.paths.rnv.platformTemplates.dir = getRealPath(
    //     c,
    //     originalPath,
    //     'platformTemplatesDir',
    //     originalPath
    // );
    // // const originalPath = c.buildConfig.paths.platformTemplatesDir || c.buildConfig.platformTemplatesDir || engineTemplDir;
    //
    // if (engine?.platforms) {
    //     const supportedPlatforms = Object.keys(engine.platforms);
    //
    //     supportedPlatforms.forEach((v) => {
    //
    //     });
    //     return result;
    // }

    return result;
};

const _listAppConfigsFoldersSync = (
    dirPath,
    configDirs,
    ignoreHiddenConfigs
) => {
    logDebug(`_listAppConfigsFoldersSync:${dirPath}`);
    if (!fsExistsSync(dirPath)) return;
    fsReaddirSync(dirPath).forEach((dir) => {
        const appConfigDir = path.join(dirPath, dir);
        if (
            !IGNORE_FOLDERS.includes(dir)
            && fsLstatSync(appConfigDir).isDirectory()
        ) {
            if (ignoreHiddenConfigs) {
                const appConfig = path.join(appConfigDir, RENATIVE_CONFIG_NAME);
                if (fsExistsSync(appConfig)) {
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
    logTask('listAppConfigsFoldersSync', `ignoreHiddenConfigs:${!!ignoreHiddenConfigs}`);
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

// export const loadPlatformTemplates = (c) => {
//     c.files.rnv.platformTemplates.config = readObjectSync(
//         c.paths.rnv.platformTemplates.config
//     );
// };

export const loadEngines = (c) => {
    logTask('loadEngines');
    c.files.rnv.engines.config = readObjectSync(
        c.paths.rnv.engines.config
    );
};

const _loadWorkspacesSync = (c) => {
    // CHECK WORKSPACES
    if (fsExistsSync(c.paths.rnv.configWorkspaces)) {
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
                `No workspace found in ${
                    c.paths.rnv.configWorkspaces
                }. Creating default rnv one for you`
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


export const parseRenativeConfigs = async (c) => {
    logTask('parseRenativeConfigs');
    // LOAD ./package.json
    loadFile(c.files.project, c.paths.project, 'package');

    // LOAD ./RENATIVE.*.JSON
    _loadConfigFiles(c, c.files.project, c.paths.project);

    if (c.runtime.appId) {
        c.paths.project.builds.config = path.join(
            c.paths.project.builds.dir,
            `${c.runtime.appId}_${c.platform}.json`
        );
    } else {
        c.paths.project.builds.config = path.join(
            c.paths.project.builds.dir,
            `*_${c.platform}.json`
        );
    }


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
    // loadPlatformTemplates(c);

    // LOAD ENGINES
    loadEngines(c);

    if (!c.files.project.config) {
        logDebug(`BUILD_CONFIG: c.files.project.config does not exists. path: ${c.paths.project.config}`);
        return;
    }

    // LOAD WORKSPACE /[PROJECT_NAME]/RENATIVE.*.JSON
    _generateConfigPaths(
        c.paths.workspace.project,
        path.join(c.paths.workspace.dir, c.files.project.config.projectName)
    );
    _loadConfigFiles(c, c.files.workspace.project, c.paths.workspace.project);

    c.paths.workspace.project.projectConfig.dir = path.join(
        c.paths.workspace.project.dir,
        'appConfigs',
        'base'
    );

    c.paths.workspace.project.projectConfig.dir_LEGACY = path.join(
        c.paths.workspace.project.dir,
        'projectConfig'
    );

    c.runtime.isWrapper = c.buildConfig.isWrapper;
    c.paths.project.platformTemplatesDirs = _generatePlatformTemplatePaths(c);

    if (c.runtime.appId) {
        const appConfigsDirs = c.buildConfig?.paths?.appConfigsDirs;
        // If user configured multiple appConfigsDirs, traverse and find right one
        if (appConfigsDirs?.length) {
            for (let i = 0; i < appConfigsDirs.length; i++) {
                const appConfigsDir = appConfigsDirs[i];
                _generateConfigPaths(
                    c.paths.appConfig,
                    path.join(appConfigsDir, c.runtime.appId)
                );
                c.paths.appConfig.fontsDir = path.join(c.paths.appConfig.dir, 'fonts');
                _loadConfigFiles(
                    c,
                    c.files.appConfig,
                    c.paths.appConfig,
                    appConfigsDir
                );
                if (c.files.appConfig.config) {
                    break;
                }
            }
        }
        // Fallback if nothing found
        if (!c.files.appConfig.config) {
            _generateConfigPaths(
                c.paths.appConfig,
                path.join(c.paths.project.appConfigsDir, c.runtime.appId)
            );
            _loadConfigFiles(
                c,
                c.files.appConfig,
                c.paths.appConfig,
                c.paths.project.appConfigsDir
            );
        }

        const workspaceAppConfigsDir = getRealPath(
            c,
            c.buildConfig.workspaceAppConfigsDir
        );
        c.paths.workspace.project.appConfigsDir = workspaceAppConfigsDir
          || path.join(c.paths.workspace.project.dir, 'appConfigs');

        _generateConfigPaths(
            c.paths.workspace.appConfig,
            path.join(c.paths.workspace.project.appConfigsDir, c.runtime.appId)
        );

        _loadConfigFiles(
            c,
            c.files.workspace.appConfig,
            c.paths.workspace.appConfig,
            c.paths.workspace.project.appConfigsDir
        );

        // LOAD WORKSPACE /RENATIVE.*.JSON
        _generateConfigPaths(
            c.paths.workspace,
            getRealPath(c, await getWorkspaceDirPath(c))
        );
        _loadConfigFiles(c, c.files.workspace, c.paths.workspace);

        generateLocalConfig(c);
        generateBuildConfig(c);
    }
};

export const createRnvConfig = (program, process, cmd, subCmd, { projectRoot } = {}) => {
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
                engines: {},
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
                engines: {},
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

    c.paths.rnv.dir = RNV_HOME_DIR;
    // c.paths.rnv.nodeModulesDir = path.join(c.paths.rnv.dir, 'node_modules');
    // c.paths.rnv.platformTemplates.dir = path.join(
    //     c.paths.rnv.dir,
    //     'platformTemplates'
    // );
    c.paths.rnv.engines.dir = path.join(
        c.paths.rnv.dir,
        'engineTemplates'
    );
    c.paths.rnv.pluginTemplates.dir = path.join(
        c.paths.rnv.dir,
        'pluginTemplates'
    );
    // c.paths.rnv.platformTemplates.config = path.join(
    //     c.paths.rnv.platformTemplates.dir,
    //     RENATIVE_CONFIG_PLATFORMS_NAME
    // );
    c.paths.rnv.engines.config = path.join(
        c.paths.rnv.engines.dir,
        RENATIVE_CONFIG_ENGINES_NAME
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
        fsReadFileSync(c.paths.rnv.package).toString()
    );

    c.platform = c.program.platform;
    c.paths.home.dir = USER_HOME_DIR;
    c.paths.GLOBAL_RNV_DIR = path.join(c.paths.home.dir, '.rnv');
    c.paths.GLOBAL_RNV_CONFIG = path.join(
        c.paths.GLOBAL_RNV_DIR,
        RENATIVE_CONFIG_NAME
    );
    c.paths.rnv.configWorkspaces = path.join(
        c.paths.GLOBAL_RNV_DIR,
        RENATIVE_CONFIG_WORKSPACES_NAME
    );

    if (!fsExistsSync(c.paths.GLOBAL_RNV_DIR)) {
        mkdirSync(c.paths.GLOBAL_RNV_DIR);
    }

    _generateConfigPaths(c.paths.project, projectRoot || CURRENT_DIR);

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
    c.paths.project.nodeModulesDir = path.join(
        c.paths.project.dir,
        'node_modules'
    );
    c.paths.project.srcDir = path.join(c.paths.project.dir, 'src');
    c.paths.project.appConfigsDir = path.join(
        c.paths.project.dir,
        'appConfigs'
    );
    c.paths.project.package = path.join(c.paths.project.dir, 'package.json');
    c.paths.project.rnCliConfig = path.join(
        c.paths.project.dir,
        RN_CLI_CONFIG_NAME
    );
    c.paths.project.babelConfig = path.join(
        c.paths.project.dir,
        RN_BABEL_CONFIG_NAME
    );
    c.paths.project.npmLinkPolyfill = path.join(
        c.paths.project.dir,
        'npm_link_polyfill.json'
    );
    c.paths.project.projectConfig.dir = path.join(
        c.paths.project.dir,
        'appConfigs',
        'base'
    );
    c.paths.project.projectConfig.pluginsDir = path.join(
        c.paths.project.projectConfig.dir,
        'plugins'
    );
    c.paths.project.projectConfig.fontsDir = path.join(
        c.paths.project.projectConfig.dir,
        'fonts'
    );
    c.paths.project.projectConfig.fontsDirs = [
        c.paths.project.projectConfig.fontsDir
    ];
    c.paths.project.assets.dir = path.join(
        c.paths.project.dir,
        'platformAssets'
    );
    c.paths.project.assets.runtimeDir = path.join(
        c.paths.project.assets.dir,
        'runtime'
    );
    c.paths.project.assets.config = path.join(
        c.paths.project.assets.dir,
        RENATIVE_CONFIG_RUNTIME_NAME
    );
    c.paths.project.builds.dir = path.join(
        c.paths.project.dir,
        'platformBuilds'
    );

    _generateConfigPaths(c.paths.workspace, c.paths.GLOBAL_RNV_DIR);

    // LOAD WORKSPACES
    try {
        _loadWorkspacesSync(c);
    } catch (e) {
        logError(e);
    }

    return c;
};
