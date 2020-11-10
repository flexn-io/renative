/* eslint-disable import/no-dynamic-require, global-require */
import path from 'path';
import { IS_LINKED, RNV_HOME_DIR } from '../constants';
import { logDebug, logTask, chalk, logInfo, logWarning } from '../systemManager/logger';
import { getConfigProp } from '../common';
import { executeAsync } from '../systemManager/exec';
import { doResolve } from '../systemManager/resolve';
import { getScopedVersion } from '../systemManager/utils';
import { fsExistsSync, writeFileSync } from '../systemManager/fileutils';
import { installPackageDependencies } from '../systemManager/npmUtils';


const ENGINES_BY_INDEX = [];
const ENGINES_BY_ID = {};
const ENGINES_BY_PLATFORM = {};
const ENGINE_CORE = 'engine-core';

export const registerEngine = async (c, engine, platform, engConfig) => {
    ENGINES_BY_ID[engine.config.id] = engine;

    c.runtime.enginesById[engine.config.id] = engine;
    ENGINES_BY_INDEX.push(engine);
    if (engConfig?.packageName) {
        engine.rootPath = path.dirname(require.resolve(`${engConfig.packageName}/package.json`));
        engine.originalTemplatePlatformsDir = path.join(engine.rootPath, 'templates/platforms');
        engine.originalTemplateAssetsDir = path.join(engine.rootPath, 'templates/assets');
        engine.originalTemplatePlatformProjectDir = path.join(
            engine.originalTemplatePlatformsDir,
            engine.projectDirName
        );
    }
    _registerEnginePlatform(c, platform, engine);
};

const _registerEnginePlatform = (c, platform, engine) => {
    if (platform) {
        ENGINES_BY_PLATFORM[platform] = engine;
        c.runtime.enginesByPlatform[platform] = engine;
    }
};

export const registerEngineExtension = (ext, eExt, extras = []) => {
    const e1 = ext ? `${ext}.` : '';
    const e2 = eExt ? `${eExt}.` : '';
    const extArr = [
        `${e1}${e2}jsx`, `${e1}jsx`, `${e1}${e2}js`, `${e1}js`,
        `${e1}${e2}tsx`, `${e1}tsx`, `${e1}${e2}ts`, `${e1}ts`,
        ...extras
    ];
    return extArr;
};

export const generateEngineExtensions = (exts, config) => {
    const { id, engineExtension } = config;
    let extArr = [...registerEngineExtension(id)];
    exts.forEach((ext) => {
        extArr = extArr.concat(registerEngineExtension(ext, engineExtension));
    });
    extArr = extArr.concat(registerEngineExtension(null, null, ['mjs', 'json', 'wasm']));
    return extArr;
};

export const generateEngineTasks = (taskArr) => {
    const tasks = {};
    taskArr.forEach((taskInstance) => {
        tasks[taskInstance.task] = taskInstance;
    });
    return tasks;
};

export const configureEngines = async (c) => {
    logTask('configureEngines');
    if (c.runtime.isWrapper) return true;
    const { engines } = c.files.project.config;
    const { devDependencies } = c.files.project.package;
    let needsPackageUpdate = false;
    if (engines) {
        Object.keys(engines).forEach((k) => {
            const engVer = c.buildConfig.engineTemplates?.[k]?.version;
            if (engVer) {
                if (devDependencies[k]) {
                    if (devDependencies[k] !== engVer) {
                        needsPackageUpdate = true;
                        logInfo(`Updating missing engine ${k} ${
                            chalk().red(devDependencies[k])}=>${chalk().green(engVer)} to package.json`);
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

export const registerMissingPlatformEngines = async (c, taskInstance) => {
    logTask('registerMissingPlatformEngines');
    if (!taskInstance.isGlobalScope && taskInstance?.platforms?.length === 0) {
        const registerEngineList = [];
        c.buildConfig.defaults.supportedPlatforms.forEach((platform) => {
            registerEngineList.push(
                _registerPlatformEngine(c, platform)
            );
        });

        if (registerEngineList.length) {
            await Promise.all(registerEngineList);
        }
    }

    return true;
};

export const loadEngines = async (c) => {
    logTask('loadEngines');
    const engines = c.buildConfig?.engines;
    // c.runtime.engineConfigs = {};
    const enginesToInstall = [];
    const readyEngines = [];
    if (engines) {
        Object.keys(engines).forEach((k) => {
            const engineRootPath = doResolve(k);
            const configPath = engineRootPath ? path.join(engineRootPath, 'renative.engine.json') : null;
            if (!configPath || !fsExistsSync(configPath)) {
                const engVer = getScopedVersion(c, k, engines[k], 'engineTemplates');
                if (engVer) {
                    enginesToInstall.push({
                        key: k,
                        version: engVer
                    });
                }
            } else {
                readyEngines.push(k);
            }
        });
        if (enginesToInstall.length) {
            logInfo(`Some engines not installed in your project:
${enginesToInstall.map(v => `> ${v.key}@${v.version}`).join('\n')}
 INSTALLING...`);

            // If package.json exists use conventional install.
            if (fsExistsSync(c.paths.project.package)) {
                enginesToInstall.forEach((v) => {
                    c.files.project.package.devDependencies[v.key] = v.version;
                    writeFileSync(c.paths.project.package, c.files.project.package);
                });
                await installPackageDependencies(c);
            } else {
                await Promise.all(enginesToInstall.map(v => executeAsync(`npm i ${v.key}@${v.version}`, {
                    cwd: c.paths.project.dir
                })));
            }


            return loadEngines(c);
        }
        // All engines ready to be registered
        _registerPlatformEngine(c, c.platform);
    } else if (c.files.project.config) {
        logInfo('Engine configs missing in your renative.json. FIXING...DONE');
        c.files.project.config.engines = {
            '@rnv/engine-rn': 'source:rnv',
            '@rnv/engine-rn-web': 'source:rnv',
            '@rnv/engine-rn-next': 'source:rnv',
            '@rnv/engine-rn-electron': 'source:rnv'
        };
        // TODO: use parseRenativeConfigs instead
        c.buildConfig.engines = c.files.project.config.engines;

        writeFileSync(c.paths.project.config, c.files.project.config);
        return loadEngines(c);
    }
    return true;
};

const _getMergedEngineConfigs = (c) => {
    const engines = c.buildConfig?.engines;
    const engineTemplates = c.buildConfig?.engineTemplates;
    const mergedEngineConfigs = {};
    Object.keys(engineTemplates).forEach((packageName) => {
        mergedEngineConfigs[packageName] = {
            packageName,
            ...engineTemplates[packageName]
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
            } else {
                mergedEngineConfigs[enginePackageName] = engineVal;
            }
        });
    }
    return mergedEngineConfigs;
};

const _getEngineConfigByPlatform = (c, platform) => {
    const mergedEngineConfigs = _getMergedEngineConfigs(c);
    const engineId = c.program.engine || getConfigProp(c, platform, 'engine');
    let selectedEngineConfig;
    Object.values(mergedEngineConfigs).forEach((engineConfig) => {
        if (engineConfig.id === engineId) {
            selectedEngineConfig = engineConfig;
        }
    });

    return selectedEngineConfig;
};


const _registerPlatformEngine = (c, platform) => {
    // Only register active platform engine to be faster
    const selectedEngineConfig = _getEngineConfigByPlatform(c, platform);
    if (selectedEngineConfig) {
        const existingEngine = ENGINES_BY_ID[selectedEngineConfig.id];
        if (!existingEngine) {
            if (IS_LINKED) {
                // In the instances of running linked rnv instead of installed one load local packages
                const pth = require.resolve(selectedEngineConfig.packageName, { paths: [path.join(RNV_HOME_DIR, '..')] });
                registerEngine(c, require(
                    pth
                )?.default, platform, selectedEngineConfig);
            } else {
                registerEngine(c, require(selectedEngineConfig.packageName)?.default, platform, selectedEngineConfig);
            }
        } else {
            _registerEnginePlatform(c, platform, existingEngine);
        }
    } else {
        logWarning(`Could not find suitable engine for platform ${platform}
Maybe you forgot to define platforms.${platform}.engine in your renative.json?`);
    }
};

export const generateEnvVars = (c, moduleConfig, nextConfig) => ({
    RNV_EXTENSIONS: getPlatformExtensions(c),
    RNV_MODULE_PATHS: moduleConfig?.modulePaths || [],
    RNV_MODULE_ALIASES: moduleConfig?.moduleAliasesArray || [],
    RNV_NEXT_TRANSPILE_MODULES: nextConfig,
    RNV_PROJECT_ROOT: c.paths.project.dir,
    RNV_MONO_ROOT: c.runtime.isWrapper ? path.join(c.paths.project.dir, '../..') : c.paths.project.dir
});

export const getPlatformExtensions = (c, excludeServer = false, addDotPrefix = false) => {
    const { engine } = c.runtime;
    let output;
    const { platforms } = engine;
    if (addDotPrefix) {
        output = platforms[c.platform].extenstions.map(v => `.${v}`).filter(ext => !excludeServer || !ext.includes('server.'));
    } else {
        output = platforms[c.platform].extenstions.filter(ext => !excludeServer || !ext.includes('server.'));
    }
    return output;
};

export const getEngineRunnerByPlatform = (c, platform, ignoreMissingError) => {
    const selectedEngine = ENGINES_BY_PLATFORM[platform];
    if (!selectedEngine && !ignoreMissingError) {
        logDebug(`ERROR: Engine for platform: ${platform} does not exists or is not registered ${new Error()}`);
        // logRaw(new Error());
    }
    return selectedEngine;
};

export const getEngineTask = (task, tasks, customTasks) => {
    const customTask = customTasks?.[task];
    if (customTask) return customTask;
    let tsk;
    const taskCleaned = task.split(' ')[0];
    tsk = tasks[task];
    if (!tsk) {
        tsk = tasks[taskCleaned];
    }
    return tsk;
};

export const hasEngineTask = (task, tasks, isProjectScope) => (
    isProjectScope ? !!getEngineTask(task, tasks) : getEngineTask(task, tasks)?.isGlobalScope);

export const getEngineSubTasks = (task, tasks, exactMatch) => Object.values(tasks).filter(v => (exactMatch ? v.task.split(' ')[0] === task : v.task.startsWith(task)));

export const getEngineRunner = (c, task, customTasks) => {
    if (customTasks?.[task]) {
        return ENGINES_BY_ID[ENGINE_CORE];
    }

    const { configExists } = c.paths.project;

    const engine = ENGINES_BY_PLATFORM[c.platform];
    if (!engine) {
        if (hasEngineTask(task, ENGINES_BY_ID[ENGINE_CORE].tasks, configExists)) return ENGINES_BY_ID[ENGINE_CORE];
        throw new Error(`Cound not find active engine for platform ${c.platform}. Available engines:
        ${ENGINES_BY_INDEX.join(', ')}`);
    }
    if (hasEngineTask(task, engine.tasks, configExists)) return engine;
    if (hasEngineTask(task, ENGINES_BY_ID[ENGINE_CORE].tasks, configExists)) return ENGINES_BY_ID[ENGINE_CORE];

    throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
};

export const getRegisteredEngines = () => ENGINES_BY_INDEX;
