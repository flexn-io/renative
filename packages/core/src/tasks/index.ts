import { logDefault, logInitTask, logExitTask, chalk, logRaw, logInfo, logWarning } from '../logger';
import { executePipe } from '../buildHooks';
import {
    getEngineRunner,
    getEngineTask,
    getRegisteredEngines,
    hasEngineTask,
    getEngineSubTasks,
    registerAllPlatformEngines,
} from '../engines';
import type { RnvContext } from '../context/types';
import type { RnvTask, RnvTaskMap, TaskItemMap, TaskObj, TaskPromptOption } from './types';
import type { RnvEngine } from '../engines/types';
import { inquirerPrompt, inquirerSeparator, pressAnyKeyToContinue } from '../api';
import { getApi } from '../api/provider';
import type { PlatformKey, RenativeConfigRnvTaskName } from '../schema/types';
import { checkIfProjectAndNodeModulesExists } from '../projects/dependencyManager';
import { DEFAULT_TASK_DESCRIPTIONS } from './constants';
import { getContext } from '../context/provider';

let executedTasks: Record<string, number> = {};

const CUSTOM_TASKS: RnvTaskMap = {};

export const registerCustomTask = async (_c: RnvContext, task: RnvTask) => {
    if (task.task) {
        CUSTOM_TASKS[task.task] = task;
    }
};

export const initializeTask = async (c: RnvContext, task: string) => {
    logDefault('initializeTask', task);
    c.runtime.task = task;
    executedTasks = {};

    getApi().analytics.captureEvent({
        type: task,
        platform: c.platform,
    });

    await executeTask(c, task, undefined, task, true);
    return true;
};

const _getTaskOption = ({ taskInstance }: TaskObj, provider?: string): TaskPromptOption => {
    const asArray = taskInstance.task.split(' ');
    const output: TaskPromptOption = {
        value: taskInstance.task,
        command: '',
        name: '',
        asArray,
        isPriorityOrder: taskInstance.isPriorityOrder,
        description: taskInstance.description,
        isGlobalScope: taskInstance.isGlobalScope,
        isPrivate: taskInstance.isPrivate,
        params: taskInstance.options,
        providers: [],
    };

    if (taskInstance.description && taskInstance.description !== '') {
        output.description = taskInstance.description;
        output.name = `${taskInstance.task} ${chalk().grey(`(${taskInstance.description})`)}`;
    } else {
        output.name = taskInstance.task;
    }
    output.command = asArray[0];
    output.subCommand = asArray[1]; // TODO don't treat options like --myopt as subcommands

    if (provider) {
        output.providers.push(provider);
    }

    return output;
};

const _getTaskObj = (taskInstance: RnvTask) => {
    const key = taskInstance.task;
    const taskNameArr = key.split(' ');
    let parent: null | string = null;
    if (taskNameArr.length > 1) {
        taskNameArr.pop();
        parent = taskNameArr.join(' ');
    }

    return {
        key,
        taskInstance,
        parent,
    };
};

export const getAllSuitableTasks = (c: RnvContext): Record<string, TaskPromptOption> => {
    const REGISTERED_ENGINES = getRegisteredEngines(c);
    const suitableTasks: Record<string, TaskPromptOption> = {};

    REGISTERED_ENGINES.forEach((engine) => {
        Object.values(engine.tasks).forEach((taskInstance) => {
            let taskObj: TaskPromptOption = _getTaskOption(_getTaskObj(taskInstance), engine?.config?.id);
            if (!suitableTasks[taskObj.value]) {
                suitableTasks[taskObj.value] = taskObj;
            } else {
                // In case of multiple competing tasks (same task name but coming from different engines)
                taskObj = suitableTasks[taskObj.value];
                // We try to revert to generic description instead.
                taskObj.description = DEFAULT_TASK_DESCRIPTIONS[taskObj.value] || taskObj.description;
                // In case of multiple competing tasks we assume they are "commonly used"
                taskObj.isPriorityOrder = true;
                taskObj.providers.push(engine?.config?.id);
            }
        });
    });
    Object.values(CUSTOM_TASKS).forEach((taskInstance) => {
        const taskObj = _getTaskOption(_getTaskObj(taskInstance), 'custom');
        suitableTasks[taskObj.value] = taskObj;
    });
    // TODO: handle integration cli options

    return suitableTasks;
};

export const findSuitableTask = async (c: RnvContext, specificTask?: string): Promise<RnvTask | undefined> => {
    logDefault('findSuitableTask');
    const REGISTERED_ENGINES = getRegisteredEngines(c);
    let task = '';
    if (!specificTask) {
        if (!c.command) {
            const suitableTasks = getAllSuitableTasks(c);

            const taskInstances = Object.values(suitableTasks);
            let tasks: TaskPromptOption[];

            let defaultCmd: string | undefined = 'new';
            let addendum = '';
            if (!c.paths.project.configExists) {
                tasks = taskInstances.filter((v) => v.isGlobalScope && !v.isPrivate).sort();
                addendum = ' (Not a ReNative project. options will be limited)';
            } else {
                tasks = taskInstances.filter((v) => !v.isPrivate).sort();
                defaultCmd = tasks.find((v) => v.value === 'run')?.name;
            }

            const commonTasks: TaskPromptOption[] = [];
            const ungroupedTasks: TaskPromptOption[] = [];
            const groupedTasks: TaskPromptOption[] = [];
            const taskGroups: Record<string, TaskPromptOption> = {};
            tasks.forEach((task) => {
                if (task.subCommand) {
                    if (!taskGroups[task.command]) {
                        const groupTask: TaskPromptOption = {
                            name: `${task.command}...`,
                            command: task.command,
                            value: task.command,
                            providers: [],
                        };
                        taskGroups[task.command] = groupTask;
                        groupedTasks.push(groupTask);
                    }
                } else if (task.isPriorityOrder) {
                    commonTasks.push(task);
                } else {
                    ungroupedTasks.push(task);
                }
            });

            const mergedTasks = [
                inquirerSeparator('─────────── Common tasks ───────────'),
                ...commonTasks,
                inquirerSeparator('─────────── More tasks ─────────────'),
                ...ungroupedTasks,
                ...groupedTasks,
            ];

            const { selectedTask } = await inquirerPrompt({
                type: 'list',
                default: defaultCmd,
                name: 'selectedTask',
                message: `Pick a command${addendum}`,
                choices: mergedTasks,
                pageSize: 15,
                logMessage: 'Welcome to the brave new world...',
            });
            c.command = selectedTask;
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

            logInfo(`could not find suitable task for ${chalk().bold(c.command)}. GETTING OPTIONS...`);
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
            `Current Engine: ${chalk().bold(c.runtime.engine?.config.id)} path: ${chalk().grey(
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
    const plats = c.runtime.engine?.platforms || [];
    c.runtime.availablePlatforms = Object.keys(plats) as PlatformKey[];
    return getEngineTask(task, c.runtime.engine?.tasks);
};

const _populateExtraParameters = (c: RnvContext, task: RnvTask) => {
    if (task.options) {
        task.options.forEach((param) => {
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
            c.program.option?.(cmd, param.description);
        });
        c.program.parse?.(process.argv);
    }
};

const _selectPlatform = async (c: RnvContext, suitableEngines: Array<RnvEngine>, task: string) => {
    const supportedPlatforms: Partial<Record<PlatformKey, true>> = {};
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
    // const pt = parentTask ? `=> [${parentTask}] ` : '';
    c._currentTask = task;
    // logInitTask(`${pt}=> [${chalk().bold.rgb(170, 106, 170)(task)}]`);
    logInitTask(`${task}`);

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
    // const prt = parentTask ? `<= [${chalk().rgb(170, 106, 170)(parentTask)}] ` : '';
    logExitTask(`${task}`);
};

/**
 * @deprecated Use executeDependantTask instead
 */
export const executeOrSkipTask = async (c: RnvContext, task: string, parentTask: string, originTask?: string) => {
    if (!c.program.only) {
        return executeTask(c, task, parentTask, originTask);
    }
    return executeTask(c, 'configureSoft', parentTask, originTask);
};

export const executeDependantTask = async ({
    task,
    parentTask,
    originTask,
    alternativeTask,
}: {
    task: string;
    parentTask: string;
    originTask?: string;
    alternativeTask?: string;
}) => {
    const ctx = getContext();
    if (!ctx.program.only) {
        return executeTask(ctx, task, parentTask, originTask);
    }
    if (alternativeTask) {
        return executeTask(ctx, alternativeTask, parentTask, originTask);
    }
    return true;
};

const ACCEPTED_CONDITIONS = ['platform', 'target', 'appId', 'scheme'] as const;

type ACKey = (typeof ACCEPTED_CONDITIONS)[number];

const _logSkip = (task: string) => {
    logInfo(`Original RNV task ${chalk().bold(task)} marked to ignore. SKIPPING...`);
};

export const shouldSkipTask = (c: RnvContext, taskKey: string, originRnvTaskName?: string) => {
    const task = taskKey as RenativeConfigRnvTaskName;
    const originTask = originRnvTaskName as RenativeConfigRnvTaskName;
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
                        const conKey = conArr[0] as ACKey;
                        if (ACCEPTED_CONDITIONS.includes(conKey)) {
                            const rt = c.runtime;
                            if (rt[conKey] === conArr[1]) {
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
    } else if (c.platform) {
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

${t.options
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
