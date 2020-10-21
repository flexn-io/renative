import path from 'path';
import { logDebug, logTask, logInitTask, logExitTask, chalk, logInfo, logError, logRaw } from '../systemManager/logger';
import { getConfigProp } from '../common';
import Analytics from '../systemManager/analytics';
import { executePipe } from '../projectManager/buildHooks';
import { inquirerPrompt, pressAnyKeyToContinue } from '../../cli/prompt';
import { checkIfProjectAndNodeModulesExists } from '../systemManager/npmUtils';
import { TASK_CONFIGURE_SOFT, EXTENSIONS } from '../constants';


const REGISTERED_ENGINES = [];
const ENGINES = {};
const ENGINE_CORE = 'engine-core';

export const registerEngine = (engine) => {
    ENGINES[engine.getId()] = engine;
    REGISTERED_ENGINES.push(engine);
};

export const generateEnvVars = (c, moduleConfig, nextConfig) => ({
    RNV_EXTENSIONS: getPlatformExtensions(c),
    RNV_MODULE_PATHS: moduleConfig?.modulePaths || [],
    RNV_MODULE_ALIASES: moduleConfig?.moduleAliasesArray || [],
    RNV_NEXT_TRANSPILE_MODULES: nextConfig,
    RNV_PROJECT_ROOT: c.paths.project.dir,
    RNV_MONO_ROOT: c.runtime.isWrapper ? path.join(c.paths.project.dir, '../..') : c.paths.project.dir
});
export const getEngineByPlatform = (c, platform, ignoreMissingError) => {
    let selectedEngineKey;
    if (c.buildConfig && !!platform) {
        selectedEngineKey = c.program.engine || getConfigProp(c, platform, 'engine');
        const selectedEngine = c.files.rnv.engines.config?.engines?.[selectedEngineKey];
        if (!selectedEngine && !ignoreMissingError) {
            logDebug(`ERROR: Engine: ${selectedEngineKey} does not exists or is not registered ${new Error()}`);
            // logRaw(new Error());
        }
        return selectedEngine;
    }
    return null;
};

export const getPlatformExtensions = (c, excludeServer) => {
    const id = c.runtime.engine.getId();
    const output = [`${id}.jsx`, `${id}.js`, `${id}.tsx`, `${id}.ts`].concat(EXTENSIONS[c.platform]).filter(ext => !excludeServer || !ext.includes('server.'));
    return output;
};

export const executeEngineTask = async (c, task, parentTask, originTask, tasks, isFirstTask) => {
    const needsHelp = Object.prototype.hasOwnProperty.call(c.program, 'help');

    const t = getEngineTask(task, tasks);

    if (needsHelp && !parentTask) {
        logRaw(`
=======================================================
INTERACTIVE HELP FOR TASK: ${chalk().green(t.task)}

Description: ${t.description}

Options:

${t.params.map((v) => {
        const option = v.shortcut ? `\`-${v.shortcut}\`, ` : '';
        return `${option}\`--${v.key}\` - ${v.description}`;
    }).join('\n')}

  `);
        if (t.fnHelp) {
            await t.fnHelp(c, parentTask, originTask);
        }

        await pressAnyKeyToContinue();
        logRaw(`
=======================================================`);
    }

    if (!t.isGlobalScope && isFirstTask) {
        if (c.files.project.package) {
            // This has to happen in order for hooks to be able to run
            await checkIfProjectAndNodeModulesExists(c);
        }
    }
    const inOnlyMode = c.program.only;
    const doPipe = !t.isGlobalScope && (!inOnlyMode || (inOnlyMode && isFirstTask));
    if (doPipe) await _executePipe(c, task, 'before');
    await t.fn(c, parentTask, originTask);
    if (doPipe) await _executePipe(c, task, 'after');
};

export const getEngineTask = (task, tasks) => {
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

export const getEngineRunnerByPlatform = (c, platform) => {
    const selectedEngine = getEngineByPlatform(c, platform);
    return ENGINES[selectedEngine?.id];
};

export const getEngineRunner = (c, task) => {
    const selectedEngine = getEngineByPlatform(c, c.platform);
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

let executedTasks = {};

export const initializeTask = async (c, task) => {
    logTask('initializeTask', task);
    c.runtime.task = task;
    executedTasks = {};

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });

    await executeTask(c, task, null, task, true);
    return true;
};

const _executePipe = async (c, task, phase) => executePipe(c, `${task.split(' ').join(':')}:${phase}`);

const TASK_LIMIT = 20;

export const executeTask = async (c, task, parentTask, originTask, isFirstTask) => {
    const pt = parentTask ? `=> [${parentTask}] ` : '';
    c._currentTask = task;
    logInitTask(`${pt}=> [${chalk().bold.rgb(170, 106, 170)(task)}]`);

    if (!executedTasks[task]) executedTasks[task] = 0;
    if (executedTasks[task] > TASK_LIMIT) {
        return Promise.reject(`You reached maximum amount of executions per one task (${TASK_LIMIT}) task: ${task}.
This is to warn you ended up in task loop.
(${task} calls same or another task which calls ${task} again)
but issue migh not be necessarily with this task

To avoid that test your task code against parentTask and avoid executing same task X from within task X`);
    }
    await getEngineRunner(c, task).executeTask(c, task, parentTask, originTask, isFirstTask);
    executedTasks[task]++;

    c._currentTask = parentTask;
    const prt = parentTask ? `<= [${chalk().rgb(170, 106, 170)(parentTask)}] ` : '';
    logExitTask(`${prt}<= ${task}`);
};

export const executeOrSkipTask = async (c, task, parentTask, originTask) => {
    if (!c.program.only) {
        return executeTask(c, task, parentTask, originTask);
    }

    return executeTask(c, TASK_CONFIGURE_SOFT, parentTask, originTask);
};

const _getTaskOption = ({ taskInstance, hasMultipleSubTasks }) => {
    if (hasMultipleSubTasks) {
        return `${taskInstance.task.split(' ')[0]}...`;
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
                if (taskInstance.task.includes(' ')) hasMultipleSubTasks = true;
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
        let addendum = '';
        if (!c.paths.project.configExists) {
            filteredTasks = taskInstances.filter(v => v.taskInstance.isGlobalScope);
            tasks = filteredTasks.map(v => _getTaskOption(v)).sort();
            tasksCommands = filteredTasks.map(v => v.taskInstance.task.split(' ')[0]).sort();
            addendum = ' (Not a ReNative project. options will be limited)';
        } else {
            tasks = taskInstances.map(v => _getTaskOption(v)).sort();
            tasksCommands = taskInstances.map(v => v.taskInstance.task.split(' ')[0]).sort();
            defaultCmd = tasks.find(v => v.startsWith('run'));
        }

        const { command } = await inquirerPrompt({
            type: 'list',
            default: defaultCmd,
            name: 'command',
            message: `Pick a command${addendum}`,
            choices: tasks,
            pageSize: 15,
            logMessage: 'Welcome to the brave new world...'
        });
        c.command = tasksCommands[tasks.indexOf(command)];
    }
    let task = c.command;
    if (c.subCommand) task += ` ${c.subCommand}`;

    let suitableEngines = REGISTERED_ENGINES.filter(engine => engine.hasTask(task, c.paths.project.configExists));
    const autocompleteEngines = REGISTERED_ENGINES.filter(engine => engine.getSubTasks(task, true).length);

    const isAutoComplete = !suitableEngines.length && !!c.command && !autocompleteEngines.length;
    const message = isAutoComplete ? `Autocomplete action for "${c.command}"` : `Pick a subCommand for ${c.command}`;

    if (!suitableEngines.length) {
        // Get all supported tasks
        const supportedSubtasksArr = [];
        REGISTERED_ENGINES.forEach((engine) => {
            engine.getSubTasks(task).forEach((taskInstance) => {
                const isNotViable = !c.paths.project.configExists && !taskInstance.isGlobalScope;
                if (!isNotViable) {
                    const taskKey = isAutoComplete ? taskInstance.task : taskInstance.task.split(' ')[1];

                    supportedSubtasksArr.push({
                        desc: taskInstance.description?.toLowerCase?.(),
                        taskKey
                    });
                }
            });
        });
        const supportedSubtasks = {};
        // Normalize task options
        const supportedSubtasksFilter = {};
        supportedSubtasksArr.forEach((tsk) => {
            const mergedTask = supportedSubtasksFilter[tsk.taskKey];
            if (!mergedTask) {
                supportedSubtasksFilter[tsk.taskKey] = tsk;
            } else if (!mergedTask.desc.includes(tsk.desc)) {
                mergedTask.desc += `, ${tsk.desc}`;
            }
        });
        // Generate final list object
        Object.values(supportedSubtasksFilter).forEach((v) => {
            const desc = v.desc ? `(${v.desc})` : '';
            const key = `${v.taskKey} ${chalk().grey(desc)}`;
            supportedSubtasks[key] = {
                taskKey: v.taskKey
            };
        });

        const subTasks = Object.keys(supportedSubtasks);
        if (subTasks.length) {
            const { subCommand } = await inquirerPrompt({
                type: 'list',
                name: 'subCommand',
                message,
                choices: subTasks,
            });
            if (isAutoComplete) {
                task = supportedSubtasks[subCommand].taskKey;
                c.command = task.split(' ')[0];
                c.subCommand = task.split(' ')[1];
                if (c.subCommand) {
                    task = `${c.command} ${c.subCommand}`;
                } else {
                    task = `${c.command}`;
                }
            } else {
                c.subCommand = supportedSubtasks[subCommand].taskKey;
                task = `${c.command} ${c.subCommand}`;
            }


            suitableEngines = REGISTERED_ENGINES.filter(engine => engine.hasTask(task, c.paths.project.configExists));
        }
    }

    if (!suitableEngines.length) {
        logError(`could not find suitable task for ${chalk().white(c.command)}`);
        c.command = null;
        c.subCommand = null;
        return findSuitableTask(c);
    }

    if (!c.platform || c.platform === true) {
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
        }
    }
    c.runtime.engine = getEngineRunner(c, task);
    logInfo(`Current Engine: ${chalk().bold.white(
        c.runtime.engine.getId()
    )}`);
    return c.runtime.engine.getTask(task);
};

export const getRegisteredEngines = () => REGISTERED_ENGINES;

export default {
    getRegisteredEngines
};
