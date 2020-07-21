/* eslint-disable import/no-cycle */
import { logDebug, logTask, logInitTask, chalk } from '../systemManager/logger';
import { getConfigProp } from '../common';
import Analytics from '../systemManager/analytics';
import {
    executePipe
} from '../projectManager/buildHooks';
import { inquirerPrompt } from '../../cli/prompt';

import EngineRn from '../../engine-rn';
import EngineRnWeb from '../../engine-rn-web';
import EngineRnElectron from '../../engine-rn-electron';
import EngineRnNext from '../../engine-rn-next';
import EngineCore from '../../engine-core';

const REGISTERED_ENGINES = [EngineRn, EngineRnWeb, EngineRnElectron, EngineRnNext, EngineCore];

const ENGINES = {
    'engine-rn': EngineRn,
    'engine-rn-web': EngineRnWeb,
    'engine-rn-electron': EngineRnElectron,
    'engine-rn-next': EngineRnNext,
};

// const EngineNoOp = {
//     executeTask: async (c, task, parentTask, originTask) => {
//         logTask('EngineNoOp:executeTask', `task:${task} parent:${parentTask} origin:${originTask}`);
//         return getEngineRunner(c, task).executeTask(c, task);
//     },
//     applyTemplate: () => {
//     }
// };


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
        if (EngineCore.hasTask(task)) return EngineCore;
        // return EngineNoOp;
        throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
    }
    const engine = ENGINES[selectedEngine?.id];
    if (!engine) {
        if (EngineCore.hasTask(task)) return EngineCore;
        throw new Error(`Cound not find active engine with id ${selectedEngine?.id}. Available engines:
        ${Object.keys(ENGINES).join(', ')}`);
    }
    if (engine.hasTask(task)) return engine;
    if (EngineCore.hasTask(task)) return EngineCore;

    throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
};

export const initializeTask = async (c, task) => {
    c.runtime.task = task;

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

export const findSuitableTask = async (c) => {
    let task = c.command;
    if (c.subCommand) task += ` ${c.subCommand}`;

    const suitableEngines = REGISTERED_ENGINES.filter(engine => engine.hasTask(task));

    if (!suitableEngines.length) {
        const supportedSubtasks = {};
        REGISTERED_ENGINES.forEach((engine) => {
            engine.getSubTasks(task).forEach((subtask) => {
                supportedSubtasks[subtask] = true;
            });
        });
        const subTasks = Object.keys(supportedSubtasks);
        if (subTasks.length) {
            const { subCommand } = await inquirerPrompt({
                type: 'list',
                name: 'subCommand',
                message: `Pick a subCommand for ${c.command}`,
                choices: subTasks,
            });

            c.subCommand = subCommand;
            task = `${c.command} ${c.subCommand}`;
        }
    }

    if (!c.platform) {
        const supportedPlatforms = {};
        suitableEngines.forEach((engine) => {
            engine.getTask(task).platforms.forEach((plat) => {
                supportedPlatforms[plat] = true;
            });
        });
        const platforms = Object.keys(supportedPlatforms);

        if (platforms.length) {
            const { platform } = await inquirerPrompt({
                type: 'list',
                name: 'platform',
                message: 'pick one of the following',
                choices: platforms,
            });
            c.platform = platform;
            return getEngineRunner(c, task).getTask(task);
        }
    }
    return getEngineRunner(c, task).getTask(task);
};
