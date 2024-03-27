import { logDefault, logInitTask, logExitTask, chalk, logRaw, logInfo } from '../logger';
import { executePipe } from '../buildHooks';
import type { RnvContext } from '../context/types';
import type { RnvTask } from './types';
import { getApi } from '../api/provider';
import { checkIfProjectAndNodeModulesExists } from '../projects/dependencies';
import { getContext } from '../context/provider';
import { RnvTaskName } from '../enums/taskName';
import { getRegisteredTasks } from './taskRegistry';
import { generateStringFromTaskOption, getTaskNameFromCommand, shouldSkipTask } from './taskHelpers';
import { getEngineRunnerByOwnerID } from '../engines';

let executedTasks: Record<string, number> = {};
const TASK_LIMIT = 20;

export const executeTask = async (opts: {
    taskName: string;
    parentTaskName?: string;
    originTaskName?: string;
    isFirstTask?: boolean;
    isOptional?: boolean;
    skipInOnlyMode?: boolean;
    alternativeTaskInOnlyMode?: string;
}) => {
    const {
        taskName,
        parentTaskName,
        originTaskName,
        isOptional,
        isFirstTask,
        skipInOnlyMode,
        alternativeTaskInOnlyMode,
    } = opts;
    const ctx = getContext();
    const inOnlyMode = ctx.program.opts().only;
    if (skipInOnlyMode && inOnlyMode) {
        const availableTasks = _findTasksByTaskName(alternativeTaskInOnlyMode || RnvTaskName.configureSoft);
        const taskInstance = await extractSingleExecutableTask(availableTasks);
        return _executeTaskInstance({ taskInstance, parentTaskName, originTaskName, isOptional, isFirstTask });
    }

    const availableTasks = _findTasksByTaskName(taskName);
    const taskInstance = await extractSingleExecutableTask(availableTasks);
    return _executeTaskInstance({ taskInstance, parentTaskName, originTaskName, isOptional, isFirstTask });
};

export const findSuitableTask = async (): Promise<RnvTask | undefined> => {
    logDefault('findSuitableTask');
    // const c = getContext();

    const taskName = getTaskNameFromCommand();
    if (!taskName) {
        // Trigger auto selection
        throw new Error('TODO interactive selection offer all tasks');
    }
    const suitableTasks = _findTasksByTaskName(taskName);

    const taskInstance = await extractSingleExecutableTask(suitableTasks);
    return taskInstance;
};

export const initializeTask = async (taskInstance: RnvTask | undefined) => {
    if (!taskInstance) {
        throw new Error('Task instance is undefined');
    }
    const { task } = taskInstance;
    logDefault('initializeTask', task);
    const c = getContext();
    _populateExtraParameters(c, taskInstance);

    c.runtime.engine = getEngineRunnerByOwnerID(taskInstance);

    logInfo(`Current engine: ${chalk().bold(taskInstance.ownerID)} ${chalk().grey(`(${c.runtime.engine?.rootPath})`)}`);
    // logInfo(
    //     `Current engine: ${chalk().bold(c.runtime.engine?.config)} ${chalk().grey(`(${c.runtime.engine?.rootPath})`)}`
    // );
    c.runtime.task = task;
    executedTasks = {};

    getApi().analytics.captureEvent({
        type: task,
        platform: c.platform,
    });

    await _executeTaskInstance({ taskInstance, originTaskName: task, isFirstTask: true });
    return true;
};

const _populateExtraParameters = (c: RnvContext, task: RnvTask) => {
    c.program?.allowUnknownOption(false); // integration options are not known ahead of time
    if (task.options) {
        task.options.forEach((opt) => {
            c.program.option?.(generateStringFromTaskOption(opt), opt.description);
        });
    }
    c.program.showHelpAfterError();
    c.program.parse?.(process.argv);
};

const _findTasksByTaskName = (taskName: string) => {
    const result: RnvTask[] = [];
    const ctx = getContext();
    const tasks = getRegisteredTasks();
    Object.values(tasks).forEach((v) => {
        const plat = ctx.platform;
        if (v.platforms && plat) {
            if (!v.platforms.includes(plat)) {
                // If we found a task with platform restriction and it does not match current platform we skip it
                return;
            }
        }

        if (v.task === taskName) {
            result.push(v);
        }
    });
    return result;
};

const _executeTaskInstance = async (opts: {
    taskInstance?: RnvTask;
    parentTaskName?: string;
    originTaskName?: string;
    isFirstTask?: boolean;
    isOptional?: boolean;
}) => {
    const { taskInstance, parentTaskName, originTaskName, isFirstTask, isOptional } = opts;
    const c = getContext();
    if (!taskInstance) {
        if (isOptional) {
            return;
        }
        throw new Error(`Task Instance is undefined`);
    }
    const needsHelp = c.program.opts().help;
    const inOnlyMode = c.program.opts().only;

    c._currentTask = taskInstance.task;
    // logInitTask(`${pt}=> [${chalk().bold.rgb(170, 106, 170)(task)}]`);
    logInitTask(`${taskInstance.task}`);

    if (!executedTasks[taskInstance.task]) executedTasks[taskInstance.task] = 0;
    if (executedTasks[taskInstance.task] > TASK_LIMIT) {
        return Promise.reject(`You reached maximum amount of executions per one task (${TASK_LIMIT}) task: ${taskInstance.task}.
This is to warn you ended up in task loop.
(${taskInstance.task} calls same or another task which calls ${taskInstance.task} again)
but issue migh not be necessarily with this task

To avoid that test your task code against parentTask and avoid executing same task X from within task X`);
    }

    if (needsHelp && !parentTaskName && taskInstance) {
        logRaw(`
Description: ${taskInstance.description}
  `);
        c.program.outputHelp();

        if (taskInstance.fnHelp) {
            await taskInstance.fnHelp();
        }
        return;
    }
    if (!taskInstance.isGlobalScope && isFirstTask) {
        if (c.files.project.package) {
            // This has to happen in order for hooks to be able to run
            await checkIfProjectAndNodeModulesExists();
        }
    }
    if (isFirstTask) {
        c.runtime.forceBuildHookRebuild = !!taskInstance?.forceBuildHookRebuild;
    }

    const doPipe = !taskInstance.isGlobalScope && (!inOnlyMode || (inOnlyMode && isFirstTask));
    if (doPipe) await _executePipe(taskInstance, 'before');
    executedTasks[taskInstance.task]++;
    c._currentTask = parentTaskName;
    const shouldSkip = shouldSkipTask({ taskName: taskInstance.task });
    if (taskInstance.dependsOn) {
        for (const dep of taskInstance.dependsOn) {
            await executeTask({ taskName: dep, parentTaskName: taskInstance.task, originTaskName });
        }
    }
    if (taskInstance.fn && !shouldSkip) {
        await taskInstance.fn({
            taskName: taskInstance.task,
            parentTaskName,
            originTaskName,
            shouldSkip,
            ctx: c,
        });
    }
    if (doPipe) await _executePipe(taskInstance, 'after');

    executedTasks[taskInstance.task]++;

    c._currentTask = parentTaskName;

    logExitTask(`${taskInstance.task}`);
};

const _executePipe = async (taskInstance: RnvTask, phase: string) =>
    executePipe(`${taskInstance.task.split(' ').join(':')}:${phase}`);

const extractSingleExecutableTask = async (suitableTasks: RnvTask[]) => {
    if (suitableTasks.length === 1) {
        return suitableTasks[0];
    } else if (suitableTasks.length > 1) {
        // Found multiple Tasks with same name
        throw new Error('TODO interactive selection multiple tasks');
    }
    // Found no tasks
    // throw new Error('TODO found no tasks');
    return undefined;
};

////////=======================////////

// const _getTaskOption = ({ taskInstance }: TaskObj, provider?: string): TaskPromptOption => {
//     const asArray = taskInstance.task.split(' ');
//     const output: TaskPromptOption = {
//         value: taskInstance.task,
//         command: '',
//         name: '',
//         asArray,
//         isPriorityOrder: taskInstance.isPriorityOrder,
//         description: taskInstance.description,
//         isGlobalScope: taskInstance.isGlobalScope,
//         isPrivate: taskInstance.isPrivate,
//         params: taskInstance.options,
//         providers: [],
//     };

//     if (taskInstance.description && taskInstance.description !== '') {
//         output.description = taskInstance.description;
//         output.name = `${taskInstance.task} ${chalk().grey(`(${taskInstance.description})`)}`;
//     } else {
//         output.name = taskInstance.task;
//     }
//     output.command = asArray[0];
//     output.subCommand = asArray[1]; // TODO don't treat options like --myopt as subcommands

//     if (provider) {
//         output.providers.push(provider);
//     }

//     return output;
// };

// const _getTaskObj = (taskInstance: RnvTask) => {
//     const key = taskInstance.task;
//     const taskNameArr = key.split(' ');
//     let parent: null | string = null;
//     if (taskNameArr.length > 1) {
//         taskNameArr.pop();
//         parent = taskNameArr.join(' ');
//     }

//     return {
//         key,
//         taskInstance,
//         parent,
//     };
// };

// export const findSuitableGlobalTask = async () => {
//     const c = getContext();
//     if (!c.command) return undefined;
//     let task = '';

//     if (c.command) task = c.command;
//     if (c.subCommand) task += ` ${c.subCommand}`;

//     c.runtime.engine = getEngineRunner(task, undefined, false);

//     const tsk = getEngineTask(task, c.runtime.engine?.tasks);

//     return tsk;
// };

// const ACCEPTED_CONDITIONS = ['platform', 'target', 'appId', 'scheme'] as const;

// type ACKey = (typeof ACCEPTED_CONDITIONS)[number];

// const _logSkip = (task: string) => {
//     logInfo(`Original RNV task ${chalk().bold(task)} marked to ignore. SKIPPING...`);
// };

////////=======================////////

// export const getAllSuitableTasks = (): Record<string, TaskPromptOption> => {
//     const REGISTERED_ENGINES = getRegisteredEngines();
//     const suitableTasks: Record<string, TaskPromptOption> = {};

//     REGISTERED_ENGINES.forEach((engine) => {
//         Object.values(engine.tasks).forEach((taskInstance) => {
//             let taskObj: TaskPromptOption = _getTaskOption(_getTaskObj(taskInstance), engine?.config?.id);
//             if (!suitableTasks[taskObj.value]) {
//                 suitableTasks[taskObj.value] = taskObj;
//             } else {
//                 // In case of multiple competing tasks (same task name but coming from different engines)

//                 taskObj = suitableTasks[taskObj.value];
//                 // We try to revert to generic description instead.
//                 taskObj.description = DEFAULT_TASK_DESCRIPTIONS[taskObj.value] || taskObj.description;
//                 // In case of multiple competing tasks we assume they are "commonly used"
//                 taskObj.isPriorityOrder = true;
//                 taskObj.providers.push(engine?.config?.id);
//             }
//         });
//     });
//     Object.values(CUSTOM_TASKS).forEach((taskInstance) => {
//         const taskObj = _getTaskOption(_getTaskObj(taskInstance), 'custom');
//         suitableTasks[taskObj.value] = taskObj;
//     });
//     // TODO: handle integration cli options

//     return suitableTasks;
// };

// export const findSuitableTask2 = async (specificTask?: string): Promise<RnvTask | undefined> => {
//     logDefault('findSuitableTask');
//     const c = getContext();

//     const REGISTERED_ENGINES = getRegisteredEngines();

//     let task = '';
//     if (!specificTask) {
//         if (!c.command) {
//             const suitableTasks = getAllSuitableTasks();

//             const taskInstances = Object.values(suitableTasks);
//             let tasks: TaskPromptOption[];

//             let defaultCmd: string | undefined = 'new';
//             let addendum = '';
//             if (!c.paths.project.configExists) {
//                 tasks = taskInstances.filter((v) => v.isGlobalScope && !v.isPrivate).sort();
//                 addendum = ' (Not a ReNative project. options will be limited)';
//             } else {
//                 tasks = taskInstances.filter((v) => !v.isPrivate).sort();
//                 defaultCmd = tasks.find((v) => v.value === 'run')?.name;
//             }

//             const commonTasks: TaskPromptOption[] = [];
//             const ungroupedTasks: TaskPromptOption[] = [];
//             const groupedTasks: TaskPromptOption[] = [];
//             const taskGroups: Record<string, TaskPromptOption> = {};
//             tasks.forEach((task) => {
//                 if (task.subCommand) {
//                     if (!taskGroups[task.command]) {
//                         const groupTask: TaskPromptOption = {
//                             name: `${task.command}...`,
//                             command: task.command,
//                             value: task.command,
//                             providers: [],
//                         };
//                         taskGroups[task.command] = groupTask;
//                         groupedTasks.push(groupTask);
//                     }
//                 } else if (task.isPriorityOrder) {
//                     commonTasks.push(task);
//                 } else {
//                     ungroupedTasks.push(task);
//                 }
//             });

//             const mergedTasks = [
//                 inquirerSeparator('─────────── Common tasks ───────────'),
//                 ...commonTasks,
//                 inquirerSeparator('─────────── More tasks ─────────────'),
//                 ...ungroupedTasks,
//                 ...groupedTasks,
//             ];

//             const { selectedTask } = await inquirerPrompt({
//                 type: 'list',
//                 default: defaultCmd,
//                 name: 'selectedTask',
//                 message: `Pick a command${addendum}`,
//                 choices: mergedTasks,
//                 pageSize: 15,
//                 logMessage: 'Welcome to the brave new world...',
//             });
//             c.command = selectedTask;
//         }
//         if (c.command) task = c.command;
//         if (c.subCommand) task += ` ${c.subCommand}`;

//         let suitableEngines = REGISTERED_ENGINES.filter((engine) => {
//             return hasEngineTask(task, engine.tasks, c.paths.project.configExists);
//         });
//         console.log('SJSKLJSK', suitableEngines);

//         const autocompleteEngines = REGISTERED_ENGINES.filter((engine) => getEngineSubTasks(task, engine, true).length);

//         const isAutoComplete = !suitableEngines.length && !!c.command && !autocompleteEngines.length;
//         if (!suitableEngines.length) {
//             // Get all supported tasks
//             const supportedSubtasksArr: Array<{
//                 desc: string;
//                 taskKey: string;
//             }> = [];
//             REGISTERED_ENGINES.forEach((engine) => {
//                 const st = getEngineSubTasks(task, engine);

//                 st.forEach((taskInstance) => {
//                     const isNotViable = !c.paths.project.configExists && !taskInstance.isGlobalScope;

//                     if (!isNotViable) {
//                         const taskKey = isAutoComplete ? taskInstance.task : taskInstance.task.split(' ')[1];

//                         supportedSubtasksArr.push({
//                             desc: taskInstance.description?.toLowerCase?.(),
//                             taskKey,
//                         });
//                     }
//                 });
//             });
//             Object.values(CUSTOM_TASKS).forEach((taskInstance) => {
//                 const tskArr = taskInstance.task.split(' ');

//                 if (task === tskArr[0] && tskArr.length > 1) {
//                     const taskKey = isAutoComplete ? taskInstance.task : taskInstance.task.split(' ')[1];

//                     supportedSubtasksArr.push({
//                         desc: taskInstance.description?.toLowerCase?.(),
//                         taskKey,
//                     });
//                 }
//             });

//             const supportedSubtasks: TaskItemMap = {};
//             // Normalize task options
//             const supportedSubtasksFilter: TaskItemMap = {};
//             supportedSubtasksArr.forEach((tsk) => {
//                 const mergedTask = supportedSubtasksFilter[tsk.taskKey];
//                 if (!mergedTask) {
//                     supportedSubtasksFilter[tsk.taskKey] = tsk;
//                 } else if (!mergedTask.desc?.includes(tsk.desc)) {
//                     mergedTask.desc += `, ${tsk.desc}`;
//                 }
//             });

//             // Generate final list object
//             Object.values(supportedSubtasksFilter).forEach((v) => {
//                 const desc = v.desc ? `(${v.desc})` : '';
//                 const key = `${v.taskKey} ${chalk().grey(desc)}`;
//                 supportedSubtasks[key] = {
//                     taskKey: v.taskKey,
//                 };
//             });

//             const subTasks = Object.keys(supportedSubtasks);
//             if (subTasks.length && c.runtime.hasAllEnginesRegistered) {
//                 // Only offer autocomple option if all engines are registered

//                 const message = isAutoComplete
//                     ? `Autocomplete action for "${c.command}"`
//                     : `Pick a subCommand for ${c.command}`;
//                 const { subCommand } = await inquirerPrompt({
//                     type: 'list',
//                     name: 'subCommand',
//                     message,
//                     choices: subTasks,
//                 });
//                 if (isAutoComplete) {
//                     task = supportedSubtasks[subCommand].taskKey;
//                     c.command = task.split(' ')[0];
//                     c.subCommand = task.split(' ')[1];
//                     if (c.subCommand) {
//                         task = `${c.command} ${c.subCommand}`;
//                     } else {
//                         task = `${c.command}`;
//                     }
//                 } else {
//                     c.subCommand = supportedSubtasks[subCommand].taskKey;
//                     task = `${c.command} ${c.subCommand}`;
//                 }

//                 suitableEngines = REGISTERED_ENGINES.filter((engine) =>
//                     hasEngineTask(task, engine.tasks, c.paths.project.configExists)
//                 );
//             }
//         }
//         if (CUSTOM_TASKS[task]) {
//             // Custom tasks are executed by core engine
//             logInfo(`Running custom task ${chalk().bold(task)}`);
//         } else if (!suitableEngines.length) {
//             if (!c.runtime.hasAllEnginesRegistered) {
//                 // No platform was specified. we have no option other than load all engines and offer platform list next round
//                 await registerAllPlatformEngines();
//                 return findSuitableTask();
//             }

//             logInfo(`could not find suitable task for ${chalk().bold(c.command)}. GETTING OPTIONS...`);
//             c.command = null;
//             c.subCommand = null;
//             return findSuitableTask();
//         }
//         //TODO: special type case for c.platform
//         if (!c.platform || c.program.opts().platform === true) {
//             await _selectPlatform(c, suitableEngines, task);
//         }
//         c.runtime.engine = getEngineRunner(task, CUSTOM_TASKS, false);
//         // Cover scenarios of -p xxxxxxxxx
//         if (!c.runtime.engine) {
//             await _selectPlatform(c, suitableEngines, task);
//             c.runtime.engine = getEngineRunner(task, CUSTOM_TASKS);
//         }
//         if (c.runtime.engine?.runtimeExtraProps) {
//             c.runtime.runtimeExtraProps = c.runtime.engine.runtimeExtraProps;
//         }

//         const customTask = CUSTOM_TASKS[task];
//         if (customTask) {
//             c.runtime.availablePlatforms = customTask.platforms == null ? [...RnvPlatforms] : customTask.platforms;
//             // _populateExtraParameters(c, customTask);
//             return customTask;
//         }
//     } else {
//         task = specificTask;
//         c.runtime.engine = getEngineRunner(task);
//     }
//     const plats = c.runtime.engine?.platforms || [];
//     c.runtime.availablePlatforms = Object.keys(plats) as PlatformKey[];
//     const engineTask = getEngineTask(task, c.runtime.engine?.tasks);
//     console.log('DJDLKDJLDKJLKDJLD', engineTask);

//     return engineTask;
// };

// const _selectPlatform = async (c: RnvContext, suitableEngines: Array<RnvEngine>, task: string) => {
//     let platforms: string[] = [];
//     const supportedEngPlatforms: string[] = [];
//     let isPlatformIndependentTask = false;
//     suitableEngines.forEach((engine) => {
//         const enPlats = getEngineTask(task, engine.tasks)?.platforms;
//         console.log(
//             'ENGPLAAA',
//             enPlats,
//             suitableEngines.map((v) => v.config.id)
//         );

//         if (enPlats) {
//             enPlats.forEach((plat) => {
//                 supportedEngPlatforms.push(plat);
//             });
//         } else {
//             // enPlats=null means task can be executed without platform
//             isPlatformIndependentTask = true;
//         }
//     });

//     if (supportedEngPlatforms.length === 0 && isPlatformIndependentTask) {
//         // If there are no tasks declaring supported platforms
//         // BUT there are tasks that can be executed without platform
//         // then we can skip platform selection
//         return;
//     }

//     const supProjPlatforms = c.buildConfig?.defaults?.supportedPlatforms;

//     if (supProjPlatforms) {
//         supProjPlatforms.forEach((plat) => {
//             if (supportedEngPlatforms.includes(plat)) {
//                 platforms.push(plat);
//             }
//         });
//     } else {
//         platforms = supportedEngPlatforms;
//     }

//     if (platforms?.length === 1) {
//         logInfo(`Only one platform available for task: ${task}. Using ${chalk().bold(platforms[0])}`);
//         c.platform = platforms[0] as PlatformKey;
//         return;
//     }

//     console.log('SLKJLSKJSL', supProjPlatforms, supportedEngPlatforms);

//     if (platforms) {
//         const { platform } = await inquirerPrompt({
//             type: 'list',
//             name: 'platform',
//             message: `Pick a platform for ${task}`,
//             choices: platforms,
//         });
//         c.platform = platform;
//     }
//     // else if (platforms.length === 1) {
//     //     c.platform = platforms[0] as PlatformKey;
//     // }
// };

// /**
//  * @deprecated Use executeDependantTask instead
//  */
// export const executeOrSkipTask = async (task: string, parentTask: string, originTask?: string) => {
//     const c = getContext();
//     if (!c.program.opts().only) {
//         return executeTask(task, parentTask, originTask);
//     }
//     return executeTask('configureSoft', parentTask, originTask);
// };

// export const executeDependantTask = async ({
//     task,
//     parentTask,
//     originTask,
//     alternativeTask,
// }: {
//     task: string;
//     parentTask: string;
//     originTask?: string;
//     alternativeTask?: string;
// }) => {
//     const ctx = getContext();
//     if (!ctx.program.opts().only) {
//         return executeTask(task, parentTask, originTask);
//     }
//     if (alternativeTask) {
//         return executeTask(alternativeTask, parentTask, originTask);
//     }
//     return true;
// };

// export const executeEngineTask = async (
//     task: string,
//     parentTask?: string,
//     originTask?: string,
//     tasks?: Record<string, RnvTask>,
//     isFirstTask?: boolean
// ) => {
//     const c = getContext();
//     const needsHelp = c.program.opts().help;

//     const taskInstance = getEngineTask(task, tasks, CUSTOM_TASKS);

//     if (!taskInstance) return;

//     if (needsHelp && !parentTask && taskInstance) {
//         logRaw(`
// Description: ${taskInstance.description}
//   `);
//         c.program.outputHelp();

//         //   ${t.options
//         //     .map((v) => {
//         //         const option = v.shortcut ? `-${v.shortcut}, ` : '';
//         //         return `  ${option}--${v.key}        ${v.description}`;
//         //     })
//         //     .join('\n')}
//         if (taskInstance.fnHelp) {
//             await taskInstance.fnHelp(c, parentTask, originTask);
//         }
//         return;
//     }
//     if (!taskInstance.isGlobalScope && isFirstTask) {
//         if (c.files.project.package) {
//             // This has to happen in order for hooks to be able to run
//             await checkIfProjectAndNodeModulesExists();
//         }
//     }
//     if (isFirstTask) {
//         c.runtime.forceBuildHookRebuild = !!taskInstance?.forceBuildHookRebuild;
//     }
//     const inOnlyMode = c.program.opts().only;
//     const doPipe = !taskInstance.isGlobalScope && (!inOnlyMode || (inOnlyMode && isFirstTask));
//     if (doPipe) await _executePipe(c, task, 'before');
//     if (taskInstance.fn) await taskInstance.fn(c, parentTask, originTask);
//     if (doPipe) await _executePipe(c, task, 'after');
// };
