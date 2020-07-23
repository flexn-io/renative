import { logDebug, logTask, logInitTask, logExitTask, chalk } from '../systemManager/logger';
import { getConfigProp } from '../common';
import Analytics from '../systemManager/analytics';
import {
    executePipe
} from '../projectManager/buildHooks';
import { inquirerPrompt } from '../../cli/prompt';

const REGISTERED_ENGINES = [];
const ENGINES = {};
const ENGINE_CORE = 'engine-core';

export const registerEngine = (engine) => {
    ENGINES[engine.getId()] = engine;
    REGISTERED_ENGINES.push(engine);
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
        if (ENGINES[ENGINE_CORE].hasTask(task)) return ENGINES[ENGINE_CORE];
        // return EngineNoOp;
        throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
    }
    const engine = ENGINES[selectedEngine?.id];
    if (!engine) {
        if (ENGINES[ENGINE_CORE].hasTask(task)) return ENGINES[ENGINE_CORE];
        throw new Error(`Cound not find active engine with id ${selectedEngine?.id}. Available engines:
        ${Object.keys(ENGINES).join(', ')}`);
    }
    if (engine.hasTask(task)) return engine;
    if (ENGINES[ENGINE_CORE].hasTask(task)) return ENGINES[ENGINE_CORE];

    throw new Error(`Cound not find suitable executor for task ${chalk().white(task)}`);
};

export const initializeTask = async (c, task) => {
    c.runtime.task = task;

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });

    return executeTask(c, task, null, task);
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
        // logTask('executeTask', `task:${task} parent:${parentTask} origin:${originTask} EXECUTING...`);
        await _executePipe(c, task, 'before');
        await getEngineRunner(c, task).executeTask(c, task, parentTask, originTask);
        await _executePipe(c, task, 'after');
    }
    c._currentTask = parentTask;
    logExitTask(`[${parentTask}] <= ${task}`);
};

const _getTaskOption = ({ taskInstance, hasMultipleSubTasks }) => {
    if (hasMultipleSubTasks) {
        return `${taskInstance.task.split(' ')[0]}${chalk().grey('...')}`;
    }
    if (taskInstance.description && taskInstance.description !== '') {
        return `${taskInstance.task.split(' ')[0]} ${chalk().grey(`(${taskInstance.description})`)}`;
    }
    return `${taskInstance.task.split(' ')[0]}`;
};

export const findSuitableTask = async (c) => {
    if (!c.command) {
        const suitableTaskInstances = {};
        REGISTERED_ENGINES.forEach((engine) => {
            engine.getTasks().forEach((taskInstance) => {
                const key = taskInstance.task.split(' ')[0];
                let hasMultipleSubTasks = false;
                if (suitableTaskInstances[key] && taskInstance.task.includes(' ')) hasMultipleSubTasks = true;
                suitableTaskInstances[key] = {
                    taskInstance,
                    hasMultipleSubTasks
                };
            });
        });
        const taskInstances = Object.values(suitableTaskInstances);
        let tasks;
        let defaultCmd = 'new';
        let tasksCommands;
        let filteredTasks;
        if (!c.paths.project.configExists) {
            filteredTasks = taskInstances.filter(v => v.taskInstance.skipProjectSetup);
            tasks = filteredTasks.map(v => _getTaskOption(v)).sort();
            tasksCommands = filteredTasks.map(v => v.taskInstance.task.split(' ')[0]).sort();
        } else {
            tasks = taskInstances.map(v => _getTaskOption(v)).sort();
            tasksCommands = taskInstances.map(v => v.taskInstance.task.split(' ')[0]).sort();
            defaultCmd = 'run';
        }

        const { command } = await inquirerPrompt({
            type: 'list',
            default: defaultCmd,
            name: 'command',
            message: 'Pick a command',
            choices: tasks,
            pageSize: 15,
            logMessage: 'You need to tell rnv what to do. NOTE: your current directory is not ReNative project. RNV options will be limited'
        });
        c.command = tasksCommands[tasks.indexOf(command)];
    }
    let task = c.command;
    if (c.subCommand) task += ` ${c.subCommand}`;

    const suitableEngines = REGISTERED_ENGINES.filter(engine => engine.hasTask(task));

    if (!suitableEngines.length) {
        const supportedSubtasks = {};
        REGISTERED_ENGINES.forEach((engine) => {
            engine.getSubTasks(task).forEach((taskInstance) => {
                const taskKey = taskInstance.task.replace(task, '').trim();
                const desc = taskInstance.description ? `(${taskInstance.description})` : '';
                const key = `${taskKey} ${chalk().grey(desc)}`;
                supportedSubtasks[key] = {
                    taskKey
                };
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

            c.subCommand = supportedSubtasks[subCommand].taskKey;
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
                message: `Pick a platform for ${task}`,
                choices: platforms,
            });
            c.platform = platform;
            return getEngineRunner(c, task).getTask(task);
        }
    }
    return getEngineRunner(c, task).getTask(task);
};
