/* eslint-disable import/no-dynamic-require, global-require */
import path from 'path';
import { logDebug, logTask, chalk, logInfo } from '../systemManager/logger';
import { getConfigProp } from '../common';
import { executeAsync } from '../systemManager/exec';
import { doResolve } from '../systemManager/resolve';
import { getScopedVersion } from '../systemManager/utils';
import { fsExistsSync, readObjectSync, writeFileSync } from '../systemManager/fileutils';
import { EXTENSIONS } from '../constants';


const REGISTERED_ENGINES = [];
const ENGINES = {};
const ENGINE_CORE = 'engine-core';

export const registerEngine = async (c, engine, platform) => {
    ENGINES[engine.getId()] = engine;
    REGISTERED_ENGINES.push(engine);
    _registerEnginePlatform(c, platform, engine);
};

const _registerEnginePlatform = (c, platform, engine) => {
    if (platform) {
        c.runtime.enginePlatforms[platform] = engine;
    }
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
                            chalk().red(devDependencies[k])}=>${engVer} to package.json`);
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
                registerPlatformEngine(c, platform)
            );
        });

        if (registerEngineList.length) {
            await Promise.all(registerEngineList);
        }
    }

    return true;
};

export const loadEngineConfigs = async (c) => {
    logTask('loadEngineConfigs');
    const engines = c.buildConfig?.engines;
    c.runtime.engineConfigs = {};
    const enginesToInstall = [];
    if (engines) {
        Object.keys(engines).forEach((k) => {
            const engineRootPath = doResolve(k);
            const configPath = engineRootPath ? path.join(engineRootPath, 'renative.engine.json') : null;
            if (configPath && fsExistsSync(configPath)) {
                const engineConfig = readObjectSync(configPath);
                c.runtime.engineConfigs[engineConfig.id] = engineConfig;
            } else {
                const engVer = getScopedVersion(c, k, engines[k], 'engineTemplates');
                if (engVer) {
                    enginesToInstall.push(`${k}@${engVer}`);
                }
            }
        });
        if (enginesToInstall.length) {
            logInfo(`Some engines not installed in your project:
${enginesToInstall.map(v => `> ${v}`).join('\n')}
 INSTALLING...`);
            await Promise.all(enginesToInstall.map(v => executeAsync(`npm i ${v} --no-save`, {
                cwd: c.paths.project.dir
            })));
            return loadEngineConfigs(c);
        }
    } else if (c.files.project.config) {
        logInfo('Engine configs missing in your renative.json. FIXING...DONE');
        c.files.project.config.engines = {
            '@rnv/engine-rn': 'source:rnv',
            '@rnv/engine-rn-web': 'source:rnv',
            '@rnv/engine-rn-next': 'source:rnv',
            '@rnv/engine-rn-electron': 'source:rnv'
        };
        writeFileSync(c.paths.project.config, c.files.project.config);
        return false;
    }
    return true;
};

export const registerPlatformEngine = (c, platform) => {
    // Only register active platform engine to be faster
    const selectedEngineConfig = getEngineConfigByPlatform(c, platform);
    if (selectedEngineConfig) {
        const existingEngine = ENGINES[selectedEngineConfig.id];
        if (!existingEngine) {
            registerEngine(c, require(selectedEngineConfig.packageName)?.default, platform);
        } else {
            _registerEnginePlatform(c, platform, existingEngine);
        }
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
export const getEngineConfigByPlatform = (c, platform, ignoreMissingError) => {
    let selectedEngineKey;
    if (c.buildConfig && !!platform && c.runtime.engineConfigs) {
        selectedEngineKey = c.program.engine || getConfigProp(c, platform, 'engine');
        const selectedEngine = c.runtime.engineConfigs[selectedEngineKey];
        if (!selectedEngine && !ignoreMissingError) {
            logDebug(`ERROR: Engine: ${selectedEngineKey} does not exists or is not registered ${new Error()}`);
            // logRaw(new Error());
        }
        return selectedEngine;
    }
    return null;
};

export const getEngineRunnerByPlatform = (c, platform) => {
    const selectedEngine = getEngineConfigByPlatform(c, platform);
    return ENGINES[selectedEngine?.id];
};

export const getPlatformExtensions = (c, excludeServer) => {
    const id = c.runtime.engine.getId();
    const output = [`${id}.jsx`, `${id}.js`, `${id}.tsx`, `${id}.ts`].concat(EXTENSIONS[c.platform]).filter(ext => !excludeServer || !ext.includes('server.'));
    return output;
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
        return ENGINES[ENGINE_CORE];
    }

    const selectedEngine = getEngineConfigByPlatform(c, c.platform);
    const { configExists } = c.paths.project;
    if (!selectedEngine) {
        if (ENGINES[ENGINE_CORE].hasTask(task, configExists)) return ENGINES[ENGINE_CORE];
        // return EngineNoOp;
        throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
    }
    c.runtime.engineConfig = selectedEngine;
    const engine = ENGINES[selectedEngine?.id];
    if (!engine) {
        if (ENGINES[ENGINE_CORE].hasTask(task, configExists)) return ENGINES[ENGINE_CORE];
        throw new Error(`Cound not find active engine with id ${selectedEngine?.id}. Available engines:
        ${Object.keys(ENGINES).join(', ')}`);
    }
    if (engine.hasTask(task, configExists)) return engine;
    if (ENGINES[ENGINE_CORE].hasTask(task, configExists)) return ENGINES[ENGINE_CORE];

    throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
};

export const getRegisteredEngines = () => REGISTERED_ENGINES;
