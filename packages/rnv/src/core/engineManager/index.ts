import path from 'path';
import { fsExistsSync, readObjectSync, writeFileSync } from '../systemManager/fileutils';
import { checkAndCreateProjectPackage, installPackageDependencies } from '../systemManager/npmUtils';
import { IS_LINKED, RNV_HOME_DIR, TVOS, ANDROID_TV, FIRE_TV } from '../constants';
import { logDebug, logTask, chalk, logInfo, logWarning, logError } from '../systemManager/logger';
import { getAppFolder, getConfigProp } from '../common';
import { doResolve } from '../systemManager/resolve';
import { getScopedVersion } from '../systemManager/utils';
import { writeRenativeConfigFile } from '../configManager';
import { configurePlugins } from '../pluginManager';
import { inquirerPrompt } from '../../cli/prompt';
import { RnvConfig } from '../configManager/types';
import { RnvTask, RnvTaskMap } from '../taskManager/types';
import { RnvModuleConfig, RnvNextJSConfig, RnvPlatform } from '../types';
import { RenativeEngineConfig, RnvEngine, RnvEngineConfig, RnvEngineConfigMap, RnvEngineInstallConfig } from './types';

const ENGINE_CORE = 'engine-core';

export const registerEngine = async (
    c: RnvConfig,
    engine: RnvEngine,
    platform?: RnvPlatform,
    engConfig?: RnvEngineConfig
) => {
    logTask(`registerEngine:${engine.config.id}`);
    c.runtime.enginesById[engine.config.id] = engine;
    engine.initializeRuntimeConfig(c);

    c.runtime.enginesByIndex.push(engine);
    if (engConfig?.packageName) {
        engine.rootPath = _resolvePkgPath(c, engConfig.packageName);
        engine.originalTemplatePlatformsDir = path.join(engine.rootPath, 'templates/platforms');
        engine.originalTemplatePlatformProjectDir = path.join(
            engine.originalTemplatePlatformsDir,
            engine.projectDirName
        );
    }
    _registerEnginePlatform(c, platform, engine);
};

const _registerEnginePlatform = (c: RnvConfig, platform?: RnvPlatform, engine?: RnvEngine) => {
    if (platform && engine) {
        c.runtime.enginesByPlatform[platform] = engine;
    }
};

export const registerEngineExtension = (ext: string | null, eExt?: string | null, extras: Array<string> = []) => {
    const e1 = ext ? `${ext}.` : '';
    const e2 = eExt ? `${eExt}.` : '';
    let extArr;
    if (eExt) {
        extArr = [
            `${e1}${e2}jsx`,
            `${e1}jsx`,
            `${e1}${e2}js`,
            `${e1}js`,
            `${e1}${e2}tsx`,
            `${e1}tsx`,
            `${e1}${e2}ts`,
            `${e1}ts`,
            ...extras,
        ];
    } else {
        extArr = [`${e1}jsx`, `${e1}js`, `${e1}tsx`, `${e1}ts`, ...extras];
    }

    return extArr;
};

export const generateEngineExtensions = (exts: Array<string>, config: RenativeEngineConfig) => {
    const { id, engineExtension } = config;
    let extArr = [...registerEngineExtension(id)];
    exts.forEach((ext) => {
        extArr = extArr.concat(registerEngineExtension(ext, engineExtension));
    });
    extArr = extArr.concat(registerEngineExtension(null, null, ['mjs', 'json', 'cjs', 'wasm']));
    return extArr;
};

export const generateEngineTasks = (taskArr: Array<RnvTask>) => {
    const tasks: RnvTaskMap = {};
    taskArr.forEach((taskInstance) => {
        tasks[taskInstance.task] = taskInstance;
    });
    return tasks;
};

export const configureEngines = async (c: RnvConfig) => {
    logTask('configureEngines');
    // const { engines } = c.files.project.config;
    const engines = _getFilteredEngines(c);
    const { devDependencies } = c.files.project.package;
    let needsPackageUpdate = false;
    if (engines && !c.runtime.skipPackageUpdate && !c.program.skipDependencyCheck && !c.program.skipRnvCheck) {
        Object.keys(engines).forEach((k) => {
            const engVer = c.buildConfig.engineTemplates?.[k]?.version;
            if (engVer) {
                if (devDependencies[k]) {
                    if (devDependencies[k] !== engVer) {
                        needsPackageUpdate = true;
                        logInfo(
                            `Updating missing engine ${k} ${chalk().red(devDependencies[k])}=>${chalk().green(
                                engVer
                            )} to package.json`
                        );
                        devDependencies[k] = engVer;
                    }
                } else {
                    needsPackageUpdate = true;
                    logInfo(`Adding missing engine ${k}@${engVer} to package.json`);
                    devDependencies[k] = engVer;
                }
            }
        });
        if (needsPackageUpdate) {
            writeFileSync(c.paths.project.package, c.files.project.package);
        }
    }
    return true;
};

export const registerMissingPlatformEngines = async (c: RnvConfig, taskInstance?: RnvTask) => {
    logTask('registerMissingPlatformEngines');
    if (
        !taskInstance ||
        (!taskInstance.isGlobalScope && taskInstance?.platforms?.length === 0) ||
        c.program.platform === 'all'
    ) {
        const registerEngineList: Array<Promise<void>> = [];
        c.buildConfig.defaults?.supportedPlatforms?.forEach((platform) => {
            registerEngineList.push(_registerPlatformEngine(c, platform));
        });

        if (registerEngineList.length) {
            await Promise.all(registerEngineList);
        }
    }

    return true;
};

export const registerAllPlatformEngines = async (c: RnvConfig) => {
    logTask('registerAllPlatformEngines');
    if (!c.buildConfig?.defaults?.supportedPlatforms?.forEach) {
        c.runtime.hasAllEnginesRegistered = true;
        return true;
    }
    const registerEngineList: Array<Promise<void>> = [];
    c.buildConfig.defaults.supportedPlatforms.forEach((platform) => {
        registerEngineList.push(_registerPlatformEngine(c, platform));
    });

    if (registerEngineList.length) {
        await Promise.all(registerEngineList);
    }
    c.runtime.hasAllEnginesRegistered = true;
    return true;
};

export const loadEnginePluginDeps = async (c: RnvConfig, engineConfigs: Array<RnvEngineInstallConfig>) => {
    logTask('loadEnginePluginDeps');
    if (c.files.project.config.isTemplate) return 0;

    // Check engine dependencies
    const addedPlugins: Record<string, Array<string>> = {};
    let hasAddedPlugins = false;
    const originalProjectPlugins = c.files.project.config_original.plugins || {};
    engineConfigs.forEach((ecf) => {
        const engineConfig = readObjectSync(ecf.configPath);

        if (engineConfig?.plugins) {
            const projectPlugins = c.files.project.config.plugins;
            // Comparing original config causes engine think that template is not extended with additional deps
            // const projectPlugins = c.files.project.config_original.plugins;

            Object.keys(engineConfig?.plugins).forEach((k) => {
                if (!projectPlugins[k]) {
                    hasAddedPlugins = true;
                    originalProjectPlugins[k] = engineConfig?.plugins[k];
                    addedPlugins[k] = addedPlugins[k] || [];
                    addedPlugins[k].push(k);
                }
            });
        }
    });
    if (hasAddedPlugins) {
        const engines = Object.keys(addedPlugins);
        const allPlugins = Object.keys(originalProjectPlugins);
        logInfo(
            `Engines: ${chalk().yellow(engines.join(','))} require plugins ${chalk().white(
                allPlugins.join(',')
            )} to be added to ${chalk().white(c.paths.project.config)}`
        );
        const confirm = await inquirerPrompt({
            name: 'selectedScheme',
            type: 'confirm',
            message: `Continue?.
If you don't want to use this dependency make sure you remove platform which requires this engine from supportedPlatforms`,
        });
        if (confirm) {
            logInfo(`Adding ${allPlugins.join(',')}. ...DONE`);
            // Prepare original file to be decorated (as addon plugins as we can't edit template itself)
            c.files.project.config_original.plugins = originalProjectPlugins;
            writeRenativeConfigFile(c, c.paths.project.config, c.files.project.config_original);
        }
    }
    return Object.keys(addedPlugins).length;
};

export const loadEnginePackageDeps = async (c: RnvConfig, engineConfigs: Array<RnvEngineInstallConfig>) => {
    logTask('loadEnginePackageDeps');
    if (c.program.skipDependencyCheck || c.files.project.config.isTemplate) return 0;
    // Check engine dependencies
    const addedDeps = [];
    engineConfigs.forEach((ecf) => {
        const engineConfig = readObjectSync(ecf.configPath);
        c.buildConfig.defaults?.supportedPlatforms?.forEach((platform) => {
            const npm = engineConfig?.platforms?.[platform]?.npm;
            if (npm) {
                if (npm.devDependencies) {
                    const deps = c.files.project.package.devDependencies || {};
                    Object.keys(npm.devDependencies).forEach((k) => {
                        if (!deps[k]) {
                            const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo');
                            if (isMonorepo) {
                                logInfo(
                                    `Engine ${ecf.key} requires npm devDependency ${k} for platform ${platform}. project marked as monorepo. SKIPPING`
                                );
                            } else {
                                logInfo(
                                    `Engine ${ecf.key} requires npm devDependency ${k} for platform ${platform}. ADDING...DONE`
                                );
                                deps[k] = npm?.devDependencies[k];
                                addedDeps.push(k);
                            }
                        }
                    });
                    c.files.project.package.devDependencies = deps;
                }
                if (npm.dependencies) {
                    const deps = c.files.project.package.dependencies || {};
                    Object.keys(npm.dependencies).forEach((k) => {
                        if (!deps[k]) {
                            if (c.files.project.config.isTemplate) {
                                if (!c.files.project.package.devDependencies[k]) {
                                    logWarning(
                                        `Engine ${ecf.key} requires npm dependency ${k} for platform ${platform}. which in template project should be placed in devDependencies`
                                    );
                                }
                            } else {
                                logInfo(
                                    `Engine ${ecf.key} requires npm dependency ${k} for platform ${platform}. ADDING...DONE`
                                );
                                deps[k] = npm?.dependencies[k];
                                addedDeps.push(k);
                            }
                        }
                    });
                    c.files.project.package.dependencies = deps;
                }
                if (npm.optionalDependencies) {
                    const deps = c.files.project.package.optionalDependencies || {};
                    Object.keys(npm.optionalDependencies).forEach((k) => {
                        if (!deps[k]) {
                            logInfo(
                                `Engine ${ecf.key} requires npm optionalDependency ${k} for platform ${platform}. ADDING...DONE`
                            );
                            deps[k] = npm?.optionalDependencies[k];
                            addedDeps.push(k);
                        }
                    });
                    c.files.project.package.optionalDependencies = deps;
                }

                if (addedDeps.length > 0) {
                    writeFileSync(c.paths.project.package, c.files.project.package);
                }
                //
            }
        });
    });
    // if (addedDeps.length > 0) {
    //     await installPackageDependencies(c);
    // }
    return addedDeps.length;
};

const ENGINE_ID_MAP: Record<string, string> = {
    'engine-lightning': '@rnv/engine-lightning',
    'engine-rn': '@rnv/engine-rn',
    'engine-rn-electron': '@rnv/engine-rn-electron',
    'engine-rn-macos': '@rnv/engine-rn-macos',
    'engine-rn-next': '@rnv/engine-rn-next',
    'engine-rn-tvos': '@rnv/engine-rn-tvos',
    'engine-rn-web': '@rnv/engine-rn-web',
    'engine-rn-windows': '@rnv/engine-rn-windows',
};

const _getFilteredEngines = (c: RnvConfig) => {
    const engines = c.buildConfig?.engines;
    if (!engines) {
        logError('Engine configs missing in your renative.json. FIXING...DONE');
        return {};
    }
    const rnvPlatforms = c.files.rnv.projectTemplates?.config?.platforms;
    const supportedPlatforms = c.files.project.config.defaults?.supportedPlatforms || [];

    const filteredEngines: Record<string, string> = {};
    supportedPlatforms.forEach((v: string) => {
        const platforms = c.files.project.config.platforms || {};
        const engineKey = platforms[v]?.engine || rnvPlatforms[v]?.engine;

        const engKey = ENGINE_ID_MAP[engineKey] || engineKey;
        if (engineKey) {
            if (engines[engKey]) {
                filteredEngines[engKey] = engines[engKey];
            } else {
                logWarning(`Platform ${v} requires engine ${engKey} which is not available in engines list`);
            }
        } else {
            logWarning(`Platform ${v} has no engine configured`);
        }
    });
    return filteredEngines;
};

export const loadEngines = async (c: RnvConfig, failOnMissingDeps?: boolean): Promise<boolean> => {
    logTask('loadEngines');
    if (!fsExistsSync(c.paths.project.config)) return true;

    const filteredEngines: Record<string, string> = _getFilteredEngines(c);
    const enginesToInstall: Array<RnvEngineInstallConfig> = [];
    const readyEngines: Array<string> = [];
    const engineConfigs: Array<RnvEngineInstallConfig> = [];
    // if (filteredEngines) {
    Object.keys(filteredEngines).forEach((k) => {
        const engineRootPath = doResolve(k);
        const configPath = engineRootPath ? path.join(engineRootPath, 'renative.engine.json') : null;
        if (!configPath || !fsExistsSync(configPath)) {
            const engVer = getScopedVersion(c, k, filteredEngines[k], 'engineTemplates');
            if (engVer) {
                enginesToInstall.push({
                    key: k,
                    version: engVer,
                    engineRootPath,
                });
            }
        } else {
            readyEngines.push(k);
            engineConfigs.push({
                key: k,
                engineRootPath,
                configPath,
            });
        }
    });

    if (enginesToInstall.length) {
        if (failOnMissingDeps) {
            return Promise.reject(`Failed to load some engines:
${enginesToInstall.map((v) => `> ${v.key}@${v.version} path: ${v.engineRootPath}`).join('\n')}`);
        }
        logInfo(`Some engines not installed in your project:
${enginesToInstall.map((v) => `> ${v.key}@${v.version}`).join('\n')}
 ADDING TO PACKAGE.JSON...DONE`);

        await checkAndCreateProjectPackage(c);
        enginesToInstall.forEach((v) => {
            c.files.project.package.devDependencies[v.key] = v.version;
            writeFileSync(c.paths.project.package, c.files.project.package);
        });
        await installPackageDependencies(c);
        return loadEngines(c, true);
    }
    const plugDepsCount = await loadEnginePluginDeps(c, engineConfigs);
    const pkgDepsCount = await loadEnginePackageDeps(c, engineConfigs);

    if (plugDepsCount + pkgDepsCount > 0) {
        c.runtime._skipPluginScopeWarnings = true;
        await configurePlugins(c); // TODO: This is too early as scoped plugin have not been installed
        c.runtime._skipPluginScopeWarnings = false;
        await installPackageDependencies(c);
    }

    // All engines ready to be registered
    _registerPlatformEngine(c, c.platform);
    // } else if (c.files.project.config_original) {
    //     logError('Engine configs missing in your renative.json. FIXING...DONE');
    // c.files.project.config_original.engines = {
    //     '@rnv/engine-rn': 'source:rnv',
    //     '@rnv/engine-rn-web': 'source:rnv',
    //     '@rnv/engine-rn-next': 'source:rnv',
    //     '@rnv/engine-rn-electron': 'source:rnv',
    //     '@rnv/engine-lightning': 'source:rnv',
    //     '@rnv/engine-rn-macos': 'source:rnv',
    // };
    // // TODO: use parseRenativeConfigs instead
    // c.buildConfig.engines = c.files.project.config_original.engines;

    // writeFileSync(c.paths.project.config, c.files.project.config_original);
    // return loadEngines(c);
    // }
    return true;
};

const _getMergedEngineConfigs = (c: RnvConfig) => {
    const engines = c.buildConfig?.engines;
    const engineTemplates = c.buildConfig?.engineTemplates || {};
    const mergedEngineConfigs: RnvEngineConfigMap = {};
    Object.keys(engineTemplates).forEach((packageName) => {
        mergedEngineConfigs[packageName] = {
            packageName,
            ...engineTemplates[packageName],
        };
    });

    const engineTemplatesKeys = Object.keys(engineTemplates);
    if (engines) {
        Object.keys(engines).forEach((enginePackageName) => {
            const engineVal = engines[enginePackageName];
            if (engineVal === 'source:rnv') {
                if (!engineTemplatesKeys.includes(enginePackageName)) {
                    logWarning(`Engine ${enginePackageName} not found in default engineTemplates`);
                }
            }
            // else {
            //     mergedEngineConfigs[enginePackageName] = engineVal;
            // }
        });
    }
    return mergedEngineConfigs;
};

const _getEngineConfigByPlatform = (c: RnvConfig, platform: string): RnvEngineConfig | null => {
    const mergedEngineConfigs = _getMergedEngineConfigs(c);
    const engineId = c.program.engine || getConfigProp(c, platform, 'engine');
    let selectedEngineConfig: RnvEngineConfig | null = null;
    Object.values(mergedEngineConfigs).forEach((engineConfig) => {
        if (engineConfig.id === engineId) {
            selectedEngineConfig = engineConfig;
        }
    });

    return selectedEngineConfig;
};

const _resolvePkgPath = (c: RnvConfig, packageName: string) => {
    if (IS_LINKED && !c.program.unlinked) {
        // In the instances of running linked rnv instead of installed one load local packages
        try {
            let pkgPathLocal = require.resolve(packageName, { paths: [path.join(RNV_HOME_DIR, '..')] });
            //TODO: this needs to be changed to support ts libs
            pkgPathLocal = pkgPathLocal.replace('/dist/index.js', '').replace('\\dist\\index.js', '');
            return pkgPathLocal;
        } catch {
            logInfo(`Running local rnv but did not find linked ${packageName}. moving on...`);
        }
    }
    let pkgPath = path.join(c.paths.project.dir, 'node_modules', packageName);
    if (fsExistsSync(pkgPath)) {
        return pkgPath;
    }
    const monoRoot = getConfigProp(c, c.platform, 'monoRoot');
    pkgPath = path.join(c.paths.project.dir, monoRoot || '../..', 'node_modules', packageName);
    if (fsExistsSync(pkgPath)) {
        return pkgPath;
    }
    pkgPath = require.resolve(packageName);

    return pkgPath;
};

const _registerPlatformEngine = async (c: RnvConfig, platform: RnvPlatform | boolean): Promise<void> => {
    // Only register active platform engine to be faster
    if (platform === true || !platform) return;
    const selectedEngineConfig = _getEngineConfigByPlatform(c, platform);
    if (selectedEngineConfig) {
        const existingEngine = c.runtime.enginesById[selectedEngineConfig.id];
        if (!existingEngine) {
            if (selectedEngineConfig.packageName) {
                registerEngine(
                    c,
                    require(_resolvePkgPath(c, selectedEngineConfig.packageName))?.default,
                    platform,
                    selectedEngineConfig
                );
            }
        } else {
            _registerEnginePlatform(c, platform, existingEngine);
        }
    } else if (platform) {
        logWarning(`Could not find suitable engine for platform ${platform}
Maybe you forgot to define platforms.${platform}.engine in your renative.json?`);
    }
};

export const generateEnvVars = (c: RnvConfig, moduleConfig: RnvModuleConfig, nextConfig: RnvNextJSConfig) => {
    const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo');
    const monoRoot = getConfigProp(c, c.platform, 'monoRoot');
    return {
        RNV_EXTENSIONS: getPlatformExtensions(c),
        RNV_ENGINE_PATH: c.runtime.engine?.rootPath,
        RNV_MODULE_PATHS: moduleConfig?.modulePaths || [],
        RNV_MODULE_ALIASES: moduleConfig?.moduleAliasesArray || [],
        RNV_NEXT_TRANSPILE_MODULES: nextConfig,
        RNV_PROJECT_ROOT: c.paths.project.dir,
        RNV_APP_BUILD_DIR: getAppFolder(c),
        RNV_IS_MONOREPO: isMonorepo,
        RNV_MONO_ROOT: isMonorepo ? path.join(c.paths.project.dir, monoRoot || '../..') : c.paths.project.dir,
        RNV_ENGINE: c.runtime.engine?.config.id,
        RNV_IS_NATIVE_TV: [TVOS, ANDROID_TV, FIRE_TV].includes(c.platform),
    };
};

export const getPlatformExtensions = (c: RnvConfig, excludeServer = false, addDotPrefix = false): Array<string> => {
    const { engine } = c.runtime;
    let output;
    if (!engine) return [];
    const { platforms } = engine;

    if (addDotPrefix) {
        output = platforms[c.platform].extensions
            .map((v) => `.${v}`)
            .filter((ext) => !excludeServer || !ext.includes('server.'));
    } else {
        output = platforms[c.platform].extensions.filter((ext) => !excludeServer || !ext.includes('server.'));
    }
    return output;
};

export const getEngineRunnerByPlatform = (c: RnvConfig, platform: string, ignoreMissingError?: boolean) => {
    const selectedEngine = c.runtime.enginesByPlatform[platform];
    if (!selectedEngine && !ignoreMissingError) {
        logDebug(`ERROR: Engine for platform: ${platform} does not exists or is not registered ${new Error()}`);
        // logRaw(new Error());
    }
    return selectedEngine;
};

export const getEngineTask = (task: string, tasks?: RnvTaskMap, customTasks?: RnvTaskMap): RnvTask | undefined => {
    const customTask = customTasks?.[task];
    if (customTask) return customTask;
    let tsk;
    const taskCleaned = task.split(' ')[0];
    if (tasks) {
        tsk = tasks[task];
        if (!tsk) {
            tsk = tasks[taskCleaned];
        }
    }

    return tsk;
};

export const hasEngineTask = (task: string, tasks: RnvTaskMap, isProjectScope?: boolean) =>
    isProjectScope ? !!getEngineTask(task, tasks) : getEngineTask(task, tasks)?.isGlobalScope;

export const getEngineSubTasks = (task: string, tasks: RnvTaskMap, exactMatch?: boolean) =>
    Object.values(tasks).filter((v) => (exactMatch ? v.task.split(' ')[0] === task : v.task.startsWith(task)));

export const getEngineRunner = (c: RnvConfig, task: string, customTasks?: RnvTaskMap, failOnMissingEngine = true) => {
    if (customTasks?.[task]) {
        return c.runtime.enginesById[ENGINE_CORE];
    }

    const { configExists } = c.paths.project;

    let engine = typeof c.platform === 'string' && c.runtime.enginesByPlatform[c.platform];
    if (!engine) {
        engine = c.runtime.enginesById['engine-core'];
    }
    if (!engine) {
        if (hasEngineTask(task, c.runtime.enginesById[ENGINE_CORE].tasks, configExists)) {
            return c.runtime.enginesById[ENGINE_CORE];
        }
        if (failOnMissingEngine) {
            throw new Error(`Cound not find active engine for platform ${c.platform}. Available engines:
        ${c.runtime.enginesByIndex.map((v) => v.config.id).join(', ')}`);
        }
        return undefined;
    }
    if (hasEngineTask(task, engine.tasks, configExists)) return engine;
    if (hasEngineTask(task, c.runtime.enginesById[ENGINE_CORE].tasks, configExists)) {
        return c.runtime.enginesById[ENGINE_CORE];
    }
    if (failOnMissingEngine) throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
    return undefined;
};

export const getRegisteredEngines = (c: RnvConfig) => c.runtime.enginesByIndex;