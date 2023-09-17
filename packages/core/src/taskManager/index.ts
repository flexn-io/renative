import { logTask, logInitTask, logExitTask, chalk, logRaw, logInfo, logWarning } from '../systemManager/logger';
import { executePipe } from '../projectManager/buildHooks';
import { checkIfProjectAndNodeModulesExists } from '../systemManager/npmUtils';
import {
    getEngineRunner,
    getEngineTask,
    getRegisteredEngines,
    hasEngineTask,
    getEngineSubTasks,
    registerAllPlatformEngines,
} from '../engineManager';
import { TASK_CONFIGURE_SOFT } from '../constants';
import { RnvContext } from '../contextManager/types';
import { RnvTask, RnvTaskMap, TaskItemMap, TaskObj } from './types';
import { RnvEngine } from '../engineManager/types';
import { inquirerPrompt, pressAnyKeyToContinue } from '../contextManager/api';
import { getContext } from '../contextManager/context';

let executedTasks: Record<string, number> = {};

const CUSTOM_TASKS: RnvTaskMap = {};

export const registerCustomTask = async (_c: RnvContext, task: RnvTask) => {
    if (task.task) {
        CUSTOM_TASKS[task.task] = task;
    }
};

export const initializeTask = async (c: RnvContext, task: string) => {
    logTask('initializeTask', task);
    c.runtime.task = task;
    executedTasks = {};

    getContext().analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform,
    });

    await executeTask(c, task, undefined, task, true);
    return true;
};

const _getTaskOption = ({ taskInstance, hasMultipleSubTasks }: TaskObj) => {
    if (hasMultipleSubTasks) {
        return `${taskInstance.task.split(' ')[0]}...`;
    }
    if (taskInstance.description && taskInstance.description !== '') {
        return `${taskInstance.task.split(' ')[0]} ${chalk().grey(`(${taskInstance.description})`)}`;
    }
    return `${taskInstance.task.split(' ')[0]}`;
};

const _getTaskObj = (taskInstance: RnvTask) => {
    const key = taskInstance.task.split(' ')[0];
    let hasMultipleSubTasks = false;
    if (taskInstance.task.includes(' ')) hasMultipleSubTasks = true;
    return {
        key,
        taskInstance,
        hasMultipleSubTasks,
    };
};

export const findSuitableTask = async (c: RnvContext, specificTask?: string): Promise<RnvTask | undefined> => {
    logTask('findSuitableTask');
    const REGISTERED_ENGINES = getRegisteredEngines(c);
    let task = '';
    if (!specificTask) {
        if (!c.command) {
            const suitableTaskInstances: Record<string, TaskObj> = {};
            REGISTERED_ENGINES.forEach((engine) => {
                Object.values(engine.tasks).forEach((taskInstance) => {
                    const taskObj = _getTaskObj(taskInstance);
                    suitableTaskInstances[taskObj.key] = taskObj;
                });
            });
            Object.values(CUSTOM_TASKS).forEach((taskInstance) => {
                const taskObj = _getTaskObj(taskInstance);
                suitableTaskInstances[taskObj.key] = taskObj;
            });

            const taskInstances = Object.values(suitableTaskInstances);
            let tasks;
            let defaultCmd: string | undefined = 'new';
            let tasksCommands;
            let filteredTasks;
            let addendum = '';
            if (!c.paths.project.configExists) {
                filteredTasks = taskInstances.filter((v) => v.taskInstance.isGlobalScope);
                tasks = filteredTasks.map((v) => _getTaskOption(v)).sort();
                tasksCommands = filteredTasks.map((v) => v.taskInstance.task.split(' ')[0]).sort();
                addendum = ' (Not a ReNative project. options will be limited)';
            } else {
                tasks = taskInstances.map((v) => _getTaskOption(v)).sort();
                tasksCommands = taskInstances.map((v) => v.taskInstance.task.split(' ')[0]).sort();
                defaultCmd = tasks.find((v) => v.startsWith('run'));
            }

            const { command } = await inquirerPrompt({
                type: 'list',
                default: defaultCmd,
                name: 'command',
                message: `Pick a command${addendum}`,
                choices: tasks,
                pageSize: 15,
                logMessage: 'Welcome to the brave new world...',
            });
            c.command = tasksCommands[tasks.indexOf(command)];
        }
        if (c.command) task = c.command;
        if (c.subCommand) task += ` ${c.subCommand}`;

        let suitableEngines = REGISTERED_ENGINES.filter((engine) =>
            hasEngineTask(task, engine.tasks, c.paths.project.configExists)
        );

        const autocompleteEngines = REGISTERED_ENGINES.filter(
            (engine) => getEngineSubTasks(task, engine.tasks, true).length
        );

        const isAutoComplete = !suitableEngines.length && !!c.command && !autocompleteEngines.length;
        const message = isAutoComplete
            ? `Autocomplete action for "${c.command}"`
            : `Pick a subCommand for ${c.command}`;

        if (!suitableEngines.length) {
            // Get all supported tasks
            const supportedSubtasksArr: Array<{
                desc: string;
                taskKey: string;
            }> = [];
            REGISTERED_ENGINES.forEach((engine) => {
                getEngineSubTasks(task, engine.tasks).forEach((taskInstance) => {
                    const isNotViable = !c.paths.project.configExists && !taskInstance.isGlobalScope;
                    if (!isNotViable) {
                        const taskKey = isAutoComplete ? taskInstance.task : taskInstance.task.split(' ')[1];

                        supportedSubtasksArr.push({
                            desc: taskInstance.description?.toLowerCase?.(),
                            taskKey,
                        });
                    }
                });
            });
            Object.values(CUSTOM_TASKS).forEach((taskInstance) => {
                const tskArr = taskInstance.task.split(' ');
                if (task === tskArr[0]) {
                    const taskKey = isAutoComplete ? taskInstance.task : taskInstance.task.split(' ')[1];

                    supportedSubtasksArr.push({
                        desc: taskInstance.description?.toLowerCase?.(),
                        taskKey,
                    });
                }
            });
            const supportedSubtasks: TaskItemMap = {};
            // Normalize task options
            const supportedSubtasksFilter: TaskItemMap = {};
            supportedSubtasksArr.forEach((tsk) => {
                const mergedTask = supportedSubtasksFilter[tsk.taskKey];
                if (!mergedTask) {
                    supportedSubtasksFilter[tsk.taskKey] = tsk;
                } else if (!mergedTask.desc?.includes(tsk.desc)) {
                    mergedTask.desc += `, ${tsk.desc}`;
                }
            });

            // Generate final list object
            Object.values(supportedSubtasksFilter).forEach((v) => {
                const desc = v.desc ? `(${v.desc})` : '';
                const key = `${v.taskKey} ${chalk().grey(desc)}`;
                supportedSubtasks[key] = {
                    taskKey: v.taskKey,
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

                suitableEngines = REGISTERED_ENGINES.filter((engine) =>
                    hasEngineTask(task, engine.tasks, c.paths.project.configExists)
                );
            }
        }

        if (CUSTOM_TASKS[task]) {
            // Custom tasks are executed by core engine
            logInfo(`Running custom task ${task}`);
        } else if (!suitableEngines.length) {
            if (!c.runtime.hasAllEnginesRegistered) {
                // No platform was specified. we have no option other than load all engines and offer platform list next round
                await registerAllPlatformEngines(c);
                return findSuitableTask(c);
            }

            logInfo(`could not find suitable task for ${chalk().white(c.command)}. GETTING OPTIONS...`);
            c.command = null;
            c.subCommand = null;
            return findSuitableTask(c);
        }
        //TODO: special type case for c.platform
        if (!c.platform || c.program.platform === true) {
            await _selectPlatform(c, suitableEngines, task);
        }
        c.runtime.engine = getEngineRunner(c, task, CUSTOM_TASKS, false);
        // Cover scenarios of -p xxxxxxxxx
        if (!c.runtime.engine) {
            await _selectPlatform(c, suitableEngines, task);
            c.runtime.engine = getEngineRunner(c, task, CUSTOM_TASKS);
        }
        if (c.runtime.engine?.runtimeExtraProps) {
            c.runtime.runtimeExtraProps = c.runtime.engine.runtimeExtraProps;
        }
        logInfo(
            `Current Engine: ${chalk().bold.white(c.runtime.engine?.config.id)} path: ${chalk().grey(
                c.runtime.engine?.rootPath
            )}`
        );
        const customTask = CUSTOM_TASKS[task];
        if (customTask) {
            c.runtime.availablePlatforms = customTask.platforms;
            _populateExtraParameters(c, customTask);
            return customTask;
        }
    } else {
        task = specificTask;
        c.runtime.engine = getEngineRunner(c, task);
    }
    c.runtime.availablePlatforms = Object.keys(c.runtime.engine?.platforms || []);
    return getEngineTask(task, c.runtime.engine?.tasks);
};

const _populateExtraParameters = (c: RnvContext, task: RnvTask) => {
    if (task.params) {
        task.params.forEach((param) => {
            let cmd = '';
            if (param.shortcut) {
                cmd += `-${param.shortcut}, `;
            }
            cmd += `--${param.key}`;
            if (param.value) {
                if (param.isRequired) {
                    cmd += ` <${param.value}>`;
                } else {
                    cmd += ` [${param.value}]`;
                }
            }
            c.program.option(cmd, param.description);
        });
        c.program.parse(process.argv);
    }
};

const _selectPlatform = async (c: RnvContext, suitableEngines: Array<RnvEngine>, task: string) => {
    const supportedPlatforms: Record<string, true> = {};
    suitableEngines.forEach((engine) => {
        getEngineTask(task, engine.tasks)?.platforms.forEach((plat) => {
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
};

const _executePipe = async (c: RnvContext, task: string, phase: string) =>
    executePipe(c, `${task.split(' ').join(':')}:${phase}`);

const TASK_LIMIT = 20;

export const executeTask = async (
    c: RnvContext,
    task: string,
    parentTask?: string,
    originTask?: string,
    isFirstTask?: boolean
) => {
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
    await executeEngineTask(
        c,
        task,
        parentTask,
        originTask,
        getEngineRunner(c, task, CUSTOM_TASKS)?.tasks,
        isFirstTask
    );
    // await getEngineRunner(c, task, CUSTOM_TASKS).executeTask(c, task, parentTask, originTask, isFirstTask);
    executedTasks[task]++;

    c._currentTask = parentTask;
    const prt = parentTask ? `<= [${chalk().rgb(170, 106, 170)(parentTask)}] ` : '';
    logExitTask(`${prt}<= ${task}`);
};

export const executeOrSkipTask = async (c: RnvContext, task: string, parentTask: string, originTask?: string) => {
    if (!c.program.only) {
        return executeTask(c, task, parentTask, originTask);
    }

    return executeTask(c, TASK_CONFIGURE_SOFT, parentTask, originTask);
};

const ACCEPTED_CONDITIONS = ['platform', 'target', 'appId', 'scheme'];

const _logSkip = (task: string) => {
    logInfo(`Original RNV task ${chalk().white(task)} marked to ignore. SKIPPING...`);
};

export const shouldSkipTask = (c: RnvContext, task: string, originTask?: string) => {
    const tasks = c.buildConfig?.tasks;
    c.runtime.platform = c.platform;
    if (!tasks) return;

    if (c.program.skipTasks?.split) {
        const skipTaskArr = c.program.skipTasks.split(',');
        if (skipTaskArr.includes(task)) return true;
    }

    if (Array.isArray(tasks)) {
        for (let k = 0; k < tasks.length; k++) {
            const t = tasks[k];
            if (t.name === task) {
                if (t.filter) {
                    const conditions = t.filter.split('&');
                    let conditionsToMatch = conditions.length;
                    conditions.forEach((con: string) => {
                        const conArr = con.split('=');
                        if (ACCEPTED_CONDITIONS.includes(conArr[0])) {
                            const rt: any = c.runtime;
                            if (rt[conArr[0]] === conArr[1]) {
                                conditionsToMatch--;
                            }
                        } else {
                            logWarning(
                                `Condition ${con} not valid. only following keys are valid: ${ACCEPTED_CONDITIONS.join(
                                    ','
                                )} SKIPPING...`
                            );
                        }
                    });
                    if (conditionsToMatch === 0) {
                        if (t.ignore) {
                            _logSkip(task);
                            return true;
                        }
                    }
                } else if (t.ignore) {
                    _logSkip(task);
                    return true;
                }
            }
        }
    } else {
        const ignoreTask = tasks[task]?.platform?.[c.platform]?.ignore;
        if (ignoreTask) {
            _logSkip(task);
            return true;
        }
        if (!originTask) {
            return false;
        }
        const ignoreTasks = tasks[originTask]?.platform?.[c.platform]?.ignoreTasks || [];
        if (ignoreTasks.includes(task)) {
            logInfo(`Task ${task} marked to skip during rnv ${originTask}. SKIPPING...`);
            return true;
        }
    }

    return false;
};

export const executeEngineTask = async (
    c: RnvContext,
    task: string,
    parentTask?: string,
    originTask?: string,
    tasks?: Record<string, RnvTask>,
    isFirstTask?: boolean
) => {
    const needsHelp = Object.prototype.hasOwnProperty.call(c.program, 'help');

    const t = getEngineTask(task, tasks, CUSTOM_TASKS);

    if (needsHelp && !parentTask && t) {
        logRaw(`
=======================================================
INTERACTIVE HELP FOR TASK: ${chalk().green(t.task)}

Description: ${t.description}

Options:

${t.params
    .map((v) => {
        const option = v.shortcut ? `\`-${v.shortcut}\`, ` : '';
        return `${option}\`--${v.key}\` - ${v.description}`;
    })
    .join('\n')}

  `);
        if (t.fnHelp) {
            await t.fnHelp(c, parentTask, originTask);
        }

        await pressAnyKeyToContinue();
        logRaw(`
=======================================================`);
    }
    if (t && !t.isGlobalScope && isFirstTask) {
        if (c.files.project.package) {
            // This has to happen in order for hooks to be able to run
            await checkIfProjectAndNodeModulesExists(c);
        }
    }
    if (isFirstTask) {
        c.runtime.forceBuildHookRebuild = !!t?.forceBuildHookRebuild;
    }
    const inOnlyMode = c.program.only;
    const doPipe = t && !t.isGlobalScope && (!inOnlyMode || (inOnlyMode && isFirstTask));
    if (doPipe) await _executePipe(c, task, 'before');
    if (t && t.fn) await t.fn(c, parentTask, originTask);
    if (doPipe) await _executePipe(c, task, 'after');
};
