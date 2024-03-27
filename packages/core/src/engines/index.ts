import path from 'path';
import { fsExistsSync, readObjectSync, writeFileSync } from '../system/fs';
import { installPackageDependencies } from '../projects/npm';
import { logDebug, logDefault, chalk, logInfo, logWarning, logError } from '../logger';
import { doResolve } from '../system/resolve';
import { configurePlugins } from '../plugins';
import { RnvContext } from '../context/types';
import { RnvTask } from '../tasks/types';
import { RenativeConfigVersion, RnvPlatform } from '../types';
import { RnvEngine, RnvEngineInstallConfig, RnvEngineTemplate } from './types';
import { inquirerPrompt } from '../api';
import { getContext } from '../context/provider';
import { writeRenativeConfigFile } from '../configs/utils';
import { checkAndCreateProjectPackage } from '../projects/package';
import { getEngineTemplateByPlatform } from '../configs/engines';
import { ConfigFileEngine } from '../schema/configFiles/types';
import { getConfigProp } from '../context/contextProps';
import { registerRnvTasks } from '../tasks/taskRegistry';

// const ENGINE_CORE = 'engine-core';

export const registerEngine = async (engine: RnvEngine, platform?: RnvPlatform, engConfig?: RnvEngineTemplate) => {
    const c = getContext();
    logDefault(`registerEngine:${engine.config.id}`);
    console.log('DJDDJDJK', engine.config.id);

    c.runtime.enginesById[engine.config.id] = engine;

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
    registerRnvTasks(engine.tasks);
};

const _registerEnginePlatform = (c: RnvContext, platform?: RnvPlatform, engine?: RnvEngine) => {
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

export const generateEngineExtensions = (exts: Array<string>, config: ConfigFileEngine) => {
    const { id, engineExtension } = config;
    let extArr = [...registerEngineExtension(id)];
    exts.forEach((ext) => {
        extArr = extArr.concat(registerEngineExtension(ext, engineExtension));
    });
    extArr = extArr.concat(registerEngineExtension(null, null, ['mjs', 'json', 'cjs', 'wasm']));
    return extArr;
};

export const configureEngines = async (c: RnvContext) => {
    logDefault('configureEngines');

    const engines = _getFilteredEngines(c);
    const devDependencies = c.files.project.package.devDependencies || {};
    c.files.project.package.devDependencies = devDependencies;
    let needsPackageUpdate = false;
    if (
        engines &&
        !c.runtime.skipPackageUpdate &&
        !c.program.opts().skipDependencyCheck &&
        !c.program.opts().skipRnvCheck
    ) {
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

export const registerMissingPlatformEngines = async (taskInstance?: RnvTask) => {
    logDefault('registerMissingPlatformEngines');
    const c = getContext();

    if (
        !taskInstance ||
        (!taskInstance.isGlobalScope && taskInstance?.platforms?.length === 0) ||
        c.program.opts().platform === 'all'
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

export const registerAllPlatformEngines = async () => {
    const c = getContext();
    logDefault('registerAllPlatformEngines');

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

export const loadEnginePluginDeps = async (engineConfigs: Array<RnvEngineInstallConfig>) => {
    logDefault('loadEnginePluginDeps');
    const c = getContext();

    if (c.buildConfig?.isTemplate) return 0;

    const cnf = c.files.project.config_original;
    if (!cnf) return 0;

    // Check engine dependencies
    const addedPlugins: Record<string, Array<string>> = {};
    let hasAddedPlugins = false;
    const originalProjectPlugins = cnf.plugins || {};
    engineConfigs.forEach((ecf) => {
        const engineConfig = readObjectSync<ConfigFileEngine>(ecf.configPath);

        const engPlugins = engineConfig?.plugins;
        if (engPlugins) {
            const projectPlugins = c.files.project.config?.plugins;
            // Comparing original config causes engine think that template is not extended with additional deps
            if (projectPlugins) {
                Object.keys(engPlugins).forEach((k) => {
                    if (!projectPlugins[k]) {
                        hasAddedPlugins = true;
                        originalProjectPlugins[k] = engPlugins[k];
                        addedPlugins[k] = addedPlugins[k] || [];
                        addedPlugins[k].push(k);
                    }
                });
            }
        }
    });
    if (hasAddedPlugins) {
        const engineKeys = engineConfigs.map((v) => v.key);
        const addedPluginsKeys = Object.keys(addedPlugins);

        logInfo(
            `Engines: ${chalk().yellow(engineKeys.join(','))} require plugins ${chalk().bold(
                addedPluginsKeys.join(',')
            )} to be added to ${chalk().bold(c.paths.project.config)}`
        );
        const confirm = await inquirerPrompt({
            name: 'selectedScheme',
            type: 'confirm',
            message: `Continue?.
If you don't want to use this dependency make sure you remove platform which requires this engine from supportedPlatforms`,
        });
        if (confirm) {
            logInfo(`Adding ${addedPluginsKeys.join(',')}. ...DONE`);
            // Prepare original file to be decorated (as addon plugins as we can't edit template itself)
            cnf.plugins = originalProjectPlugins;
            writeRenativeConfigFile(c.paths.project.config, cnf);
        }
    }
    return Object.keys(addedPlugins).length;
};

export const loadEnginePackageDeps = async (engineConfigs: Array<RnvEngineInstallConfig>) => {
    logDefault('loadEnginePackageDeps');
    const c = getContext();

    if (c.program.opts().skipDependencyCheck || c.buildConfig?.isTemplate) return 0;
    // Check engine dependencies
    const addedDeps = [];
    engineConfigs.forEach((ecf) => {
        const engineConfig = readObjectSync<ConfigFileEngine>(ecf.configPath);
        c.buildConfig.defaults?.supportedPlatforms?.forEach((platform) => {
            const npm = engineConfig?.platforms?.[platform]?.npm || {};
            if (npm) {
                if (npm.devDependencies) {
                    const deps = c.files.project.package.devDependencies || {};
                    Object.keys(npm.devDependencies).forEach((k) => {
                        if (!deps[k]) {
                            const isMonorepo = getConfigProp('isMonorepo');
                            if (isMonorepo) {
                                logInfo(
                                    `Engine ${ecf.key} requires npm devDependency ${k} for platform ${platform}. project marked as monorepo. SKIPPING`
                                );
                            } else {
                                logInfo(
                                    `Engine ${ecf.key} requires npm devDependency ${k} for platform ${platform}. ADDING...DONE`
                                );
                                if (npm.devDependencies?.[k]) {
                                    deps[k] = npm.devDependencies[k];
                                    addedDeps.push(k);
                                }
                            }
                        }
                    });
                    c.files.project.package.devDependencies = deps;
                }
                if (npm.dependencies) {
                    const deps = c.files.project.package.dependencies || {};
                    Object.keys(npm.dependencies).forEach((k) => {
                        if (!deps[k]) {
                            if (c.buildConfig?.isTemplate) {
                                if (!c.files.project.package.devDependencies?.[k]) {
                                    logWarning(
                                        `Engine ${ecf.key} requires npm dependency ${k} for platform ${platform}. which in template project should be placed in devDependencies`
                                    );
                                }
                            } else {
                                logInfo(
                                    `Engine ${ecf.key} requires npm dependency ${k} for platform ${platform}. ADDING...DONE`
                                );
                                if (npm.dependencies?.[k]) {
                                    deps[k] = npm.dependencies[k];
                                    addedDeps.push(k);
                                }
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
                            if (npm.optionalDependencies?.[k]) {
                                deps[k] = npm.optionalDependencies[k];
                                addedDeps.push(k);
                            }
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

    return addedDeps.length;
};

const _getFilteredEngines = (c: RnvContext) => {
    const engines = c.buildConfig?.engines;
    if (!engines) {
        logError('Engine configs missing in your renative.json. FIXING...DONE');
        return {};
    }
    const rnvPlatforms = c.files.rnvConfigTemplates.config?.platformTemplates;
    const supportedPlatforms = c.files.project.config?.defaults?.supportedPlatforms || [];

    const filteredEngines: Record<string, string> = {};
    const ENGINE_ID_MAP = c.files.rnvConfigTemplates.config?.engineIdMap || {};

    supportedPlatforms.forEach((v) => {
        const platforms = c.files.project.config?.platforms || {};
        const engineKey = platforms[v]?.engine || rnvPlatforms?.[v]?.engine;

        if (engineKey) {
            const engKey = ENGINE_ID_MAP[engineKey] || engineKey;
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

const getScopedVersion = (
    c: RnvContext,
    key: string,
    val: RenativeConfigVersion,
    sourceObjKey: 'engineTemplates' | 'plugins'
) => {
    if (typeof val === 'string') {
        if (val.startsWith('source:')) {
            const sourceObj = c.buildConfig?.[sourceObjKey];
            const sourceObjVal = sourceObj?.[key];
            if (typeof sourceObjVal !== 'string') {
                return sourceObjVal?.version;
            } else {
                //TODO: should we warnd about this state?
            }
        } else {
            return val;
        }
    } else {
        return val?.version;
    }
    return null;
};

export const loadEngines = async (failOnMissingDeps?: boolean): Promise<boolean> => {
    logDefault('loadEngines');
    const c = getContext();

    console.log('APAPAPAPAAPAP', c.paths.project.config);

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
            logInfo(`Load engine: ${k} ${chalk().gray(`(${engineRootPath})`)}`);
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

        await checkAndCreateProjectPackage();
        const pkg = c.files.project.package;
        const devDeps = pkg.devDependencies || {};
        pkg.devDependencies = devDeps;
        enginesToInstall.forEach((v) => {
            if (v.key && v.version) {
                devDeps[v.key] = v.version;
            }
        });
        writeFileSync(c.paths.project.package, c.files.project.package);

        await installPackageDependencies();
        return loadEngines(true);
    }
    const plugDepsCount = await loadEnginePluginDeps(engineConfigs);
    const pkgDepsCount = await loadEnginePackageDeps(engineConfigs);

    if (plugDepsCount + pkgDepsCount > 0) {
        c.runtime._skipPluginScopeWarnings = true;
        await configurePlugins(); // TODO: This is too early as scoped plugin have not been installed
        c.runtime._skipPluginScopeWarnings = false;
        await installPackageDependencies();
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

const _resolvePkgPath = (c: RnvContext, packageName: string) => {
    if (c.paths.IS_LINKED && !c.program.opts().unlinked && c.paths.rnv.dir !== '') {
        // In the instances of running linked rnv instead of installed one load local packages
        try {
            let pkgPathLocal = require.resolve(packageName, { paths: [path.join(c.paths.rnv.dir, '..')] });
            pkgPathLocal = pkgPathLocal
                .replace('/dist/index.js', '')
                .replace('\\dist\\index.js', '')
                .replace('/lib/index.js', '')
                .replace('\\lib\\index.js', '');
            return pkgPathLocal;
        } catch {
            logInfo(`Running local rnv but did not find linked ${packageName}. moving on...`);
        }
    }
    let pkgPath = path.join(c.paths.project.dir, 'node_modules', packageName);
    if (fsExistsSync(pkgPath)) {
        return pkgPath;
    }
    const monoRoot = getConfigProp('monoRoot');
    pkgPath = path.join(c.paths.project.dir, monoRoot || '../..', 'node_modules', packageName);
    if (fsExistsSync(pkgPath)) {
        return pkgPath;
    }
    pkgPath = require.resolve(packageName);

    return pkgPath;
};

const _registerPlatformEngine = async (c: RnvContext, platform: RnvPlatform | boolean): Promise<void> => {
    // Only register active platform engine to be faster
    console.log('SJJSSJSJSJ', platform);

    if (platform === true || !platform) return;
    const selectedEngineTemplate = getEngineTemplateByPlatform(platform);

    if (selectedEngineTemplate) {
        const existingEngine = c.runtime.enginesById[selectedEngineTemplate.id];
        if (!existingEngine) {
            if (selectedEngineTemplate.packageName) {
                registerEngine(
                    require(_resolvePkgPath(c, selectedEngineTemplate.packageName))?.default,
                    platform,
                    selectedEngineTemplate
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

export const getEngineRunnerByPlatform = (platform: RnvPlatform, ignoreMissingError?: boolean) => {
    if (!platform) return undefined;
    const c = getContext();

    const selectedEngine = c.runtime.enginesByPlatform[platform];
    if (!selectedEngine && !ignoreMissingError) {
        logDebug(`ERROR: Engine for platform: ${platform} does not exists or is not registered ${new Error()}`);
        // logRaw(new Error());
    }
    return selectedEngine;
};

export const getEngineRunnerByOwnerID = (task: RnvTask) => {
    const ctx = getContext();
    const engine = ctx.runtime.enginesByIndex.find((v) => v.config.packageName === task.ownerID);
    return engine;
};

// const findTasksByTaskName = (taskName: string, tasks: RnvTaskMap) => {
//     const result: RnvTask[] = [];
//     const task = Object.values(tasks).forEach((v) => {
//         const plat = getContext().platform;
//         if (v.platforms && plat) {
//             if (!v.platforms.includes(plat)) {
//                 // If we found a task with platform restriction and it does not match current platform we skip it
//                 return;
//             }
//         }
//         if (v.task === taskName) {
//             result.push(v);
//         }
//     });
//     return result;
// };

// export const getEngineTask = (taskName: string, tasks?: RnvTaskMap, customTasks?: RnvTaskMap): RnvTask | undefined => {
//     const result: RnvTask[] = [];

//     if (customTasks) {
//         result.push(...findTasksByTaskName(taskName, customTasks));
//     }
//     if (!tasks) {
//         return undefined;
//     }

//     const taskInstance = findByTaskName(taskName, tasks);
//     return taskInstance;
// };

// export const hasEngineTask = (task: string, tasks: RnvTaskMap, isProjectScope?: boolean) =>
//     isProjectScope ? !!getEngineTask(task, tasks) : getEngineTask(task, tasks)?.isGlobalScope;

// export const getEngineSubTasks = (task: string, engine: RnvEngine, exactMatch?: boolean) => {
//     const ctx = getContext();
//     const { tasks } = engine;
//     const result = Object.values(tasks).filter((v) => {
//         if (ctx.platform) {
//             if (v.platforms) {
//                 if (!v.platforms.includes(ctx.platform)) {
//                     return false;
//                 }
//             }
//         }
//         return exactMatch ? v.task.split(' ')[0] === task : v.task.split(' ')[0].startsWith(task);
//     });

//     return result;
// };

// export const getEngineRunner = (task: string, customTasks?: RnvTaskMap, failOnMissingEngine = true) => {
//     const c = getContext();

//     if (customTasks?.[task]) {
//         return c.runtime.enginesById[ENGINE_CORE];
//     }

//     const { configExists } = c.paths.project;

//     let engine = typeof c.platform === 'string' && c.runtime.enginesByPlatform[c.platform];
//     if (!engine) {
//         engine = c.runtime.enginesById['engine-core'];
//     }
//     if (!engine) {
//         if (hasEngineTask(task, c.runtime.enginesById[ENGINE_CORE].tasks, configExists)) {
//             return c.runtime.enginesById[ENGINE_CORE];
//         }
//         if (failOnMissingEngine) {
//             throw new Error(`Cound not find active engine for platform ${c.platform}. Available engines:
//         ${c.runtime.enginesByIndex.map((v) => v.config.id).join(', ')}`);
//         }
//         return undefined;
//     }

//     if (hasEngineTask(task, engine.tasks, configExists)) return engine;
//     if (hasEngineTask(task, c.runtime.enginesById[ENGINE_CORE].tasks, configExists)) {
//         return c.runtime.enginesById[ENGINE_CORE];
//     }
//     if (failOnMissingEngine) throw new Error(`Cound not find suitable executor for task ${chalk().bold(task)}`);
//     return undefined;
// };

export const getRegisteredEngines = () => getContext().runtime.enginesByIndex;
