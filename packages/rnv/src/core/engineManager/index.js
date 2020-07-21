/* eslint-disable import/no-cycle */
import { logDebug, logTask, logInitTask } from '../systemManager/logger';
import { isPlatformSupported } from '../platformManager';
import {
    getConfigProp,
    isBuildSchemeSupported
} from '../common';
import { checkSdk } from '../sdkManager';
import { resolvePluginDependants } from '../pluginManager';
import Analytics from '../systemManager/analytics';
import {
    executePipe
} from '../projectManager/buildHooks';

import EngineRn from '../../engine-rn';
import EngineRnWeb from '../../engine-rn-web';
import EngineRnElectron from '../../engine-rn-electron';
import EngineRnNext from '../../engine-rn-next';
import EngineCore from '../../engine-core';

const ENGINES = {
    'engine-rn': EngineRn,
    'engine-rn-web': EngineRnWeb,
    'engine-rn-electron': EngineRnElectron,
    'engine-rn-next': EngineRnNext,
};

const EngineNoOp = {
    executeTask: async (c, task, parentTask, originTask) => {
        logTask('EngineNoOp:executeTask', `task:${task} parent:${parentTask} origin:${originTask}`);
        await isPlatformSupported(c);
        await isBuildSchemeSupported(c);
        return getEngineRunner(c, task).executeTask(c, task);
    },
    applyTemplate: () => {
    }
};


export const getEngineByPlatform = (c, platform, ignoreMissingError) => {
    let selectedEngineKey;
    if (c.buildConfig && !!platform) {
        selectedEngineKey = getConfigProp(c, platform, 'engine');
        const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];
        if (!selectedEngine && !ignoreMissingError) {
            logDebug(`ERROR: Engine: ${selectedEngineKey} does not exists or is not registered ${new Error()}`);
            // logRaw(new Error());
        }
        return selectedEngine;
    }
    return null;
};


export const getEngineRunner = (c, task) => {
    const selectedEngine = getEngineByPlatform(c, c.platform);
    if (!selectedEngine) {
        return EngineNoOp;
        // throw new Error(`Cound not find engine with ${chalk().white(c.platform)} platform support`);
    }
    const engine = ENGINES[selectedEngine?.id];
    if (!engine) {
        return EngineNoOp;
        //         throw new Error(`Cound not find active engine with id ${selectedEngine?.id}. Available engines:
        // ${Object.keys(ENGINES).join(', ')}`);
    }
    if (engine.hasTask(task)) return engine;
    if (EngineCore.hasTask(task)) return EngineCore;

    throw new Error(`Cound not find engine capable to execute task ${task}`);
};

export const initializeTask = async (c, task) => {
    c.runtime.task = task;

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);
    await getEngineRunner(c, task).applyTemplate(c);
    await resolvePluginDependants(c);

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });

    return executeTask(c, task);
};

const _executePipe = async (c, task, phase) => {
    let subCmd = '';
    if (c.subCommand) {
        subCmd = `:${c.subCommand}`;
    }
    return executePipe(c, `${task}${subCmd}:${phase}`);
};

export const executeTask = async (c, task, parentTask, originTask) => {
    const pt = parentTask ? ` => ${parentTask}` : '';
    c._currentTask = task;
    logInitTask(`executeTask${pt} => ${task}`);
    if (c.program.only && !!parentTask) {
        logTask('executeTask', `task:${task} parent:${parentTask} origin:${originTask} SKIPPING...`);
    } else {
        logTask('executeTask', `task:${task} parent:${parentTask} origin:${originTask} EXECUTING...`);
        await _executePipe(c, task, 'before');
        await getEngineRunner(c, task).executeTask(c, task, parentTask, originTask);
        await _executePipe(c, task, 'after');
    }
    c._currentTask = parentTask;
};

// export const registerEngine = (c) => {
//     console.log('REGISTER ENGINE');
// };
