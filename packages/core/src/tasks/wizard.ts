import { findSuitableTask } from './taskFinder';
import { inquirerPrompt } from '../api';
import { getContext } from '../context/provider';
import { chalk, logInfo } from '../logger';
import { getRegisteredTasks } from './taskRegistry';
import { initializeTask } from './taskExecutors.js';
import { getTaskNameFromCommand } from './taskHelpers';

type TaskOpt = {
    name: string;
    value: string;
};

export const runInteractiveWizardForSubTasks = async () => {
    const ctx = getContext();

    const tasks = getRegisteredTasks();
    const optionsMap: Record<string, TaskOpt> = {};
    Object.values(tasks).forEach((taskInstance) => {
        const taskCmdName = taskInstance.task.split(' ')[0];

        if (taskCmdName === ctx.command) {
            if (!optionsMap[taskInstance.task]) {
                optionsMap[taskInstance.task] = {
                    name: `${taskInstance.task} ${chalk().gray(taskInstance.description)}`,
                    value: taskInstance.task,
                };
            } else {
                // If multiple tasks with same name we append ... to indicate there are more options coming
                optionsMap[taskInstance.task].name = `${taskInstance.task}${chalk().gray('...')}`;
            }
        }
    });

    const options: TaskOpt[] = Object.values(optionsMap);

    if (options.length > 0) {
        if (ctx.subCommand) {
            logInfo(`No sub task named ${chalk().red(ctx.subCommand)} found. Will look for available ones instead.`);
            ctx.subCommand = null;
            // throw new Error('Trying to run interactive wizard for subtasks');
        }

        const { selectedTask } = await inquirerPrompt({
            type: 'list',
            // default: defaultCmd,
            name: 'selectedTask',
            message: `Pick a command`,
            choices: options,
            pageSize: 15,
            logMessage: 'Welcome to the brave new world...',
        });

        const taskArr = selectedTask.split(' ');
        ctx.command = taskArr[0];
        ctx.subCommand = taskArr[1] || null;

        const initTask = await findSuitableTask();
        return initializeTask(initTask);
    }

    // No subtasks found. let's resort to default wizard
    if (ctx.subCommand) {
        logInfo(`No tasks found for ${chalk().red(getTaskNameFromCommand())}. Launching wizard...`);
        ctx.subCommand = null;
        // throw new Error('Trying to run interactive wizard for subtasks');
    }
    return runInteractiveWizard();

    // Engines are bound to platform
    // If we don't know the platform yet we need to load all engines
    // await selectPlatformIfRequired();

    // initTask = await findSuitableTask();
    // return initializeTask(initTask);
};

export const runInteractiveWizard = async () => {
    // for "rnv" we simply load all engines upfront
    const ctx = getContext();

    // const taskOptions = _getWizardOptions();
    // const { options, addendum, defaultCmd } = _getGroupedWizardOptions(taskOptions);

    const tasks = getRegisteredTasks();

    const options: TaskOpt[] = [];

    Object.values(tasks).forEach((taskInstance) => {
        options.push({
            name: `${taskInstance.task} ${chalk().gray(taskInstance.description)}`,
            value: taskInstance.task,
        });
    });

    const { selectedTask } = await inquirerPrompt({
        type: 'list',
        // default: defaultCmd,
        name: 'selectedTask',
        message: `Pick a command`,
        choices: options,
        pageSize: 15,
        logMessage: 'Welcome to the brave new world...',
    });
    const taskArr = selectedTask.split(' ');
    ctx.command = taskArr[0];
    ctx.subCommand = taskArr[1] || null;

    const initTask = await findSuitableTask();
    return initializeTask(initTask);
};

// const _getGroupedWizardOptions = (taskInstances: TaskPromptOption[]) => {
//     let tasks: TaskPromptOption[];
//     const c = getContext();
//     let defaultCmd: string | undefined = 'new';
//     let addendum = '';
//     if (!c.paths.project.configExists) {
//         tasks = taskInstances.filter((v) => v.isGlobalScope && !v.isPrivate).sort();
//         addendum = ' (Not a ReNative project. options will be limited)';
//     } else {
//         tasks = taskInstances.filter((v) => !v.isPrivate).sort();
//         defaultCmd = tasks.find((v) => v.value.taskName === 'run')?.name;
//     }
//     const commonTasks: TaskPromptOption[] = [];
//     const ungroupedTasks: TaskPromptOption[] = [];
//     const groupedTasks: TaskPromptOption[] = [];
//     // const taskGroups: Record<string, TaskPromptOption> = {};
//     tasks.forEach((task) => {
//         if (task.subTasks) {
//             // if (!taskGroups[task.command]) {
//             //     const groupTask: TaskPromptOption = {
//             //         name: `${task.command}...`,
//             //         command: task.command,
//             //         value: task.command,
//             //         providers: [],
//             //     };
//             //     taskGroups[task.command] = groupTask;
//             //     groupedTasks.push(groupTask);
//             // }
//             groupedTasks.push(task);
//         } else if (task.isPriorityOrder) {
//             commonTasks.push(task);
//         } else {
//             ungroupedTasks.push(task);
//         }
//     });

//     const mergedTasks = [
//         inquirerSeparator('─────────── Common tasks ───────────'),
//         ...commonTasks,
//         inquirerSeparator('─────────── More tasks ─────────────'),
//         ...ungroupedTasks,
//         ...groupedTasks,
//     ];

//     return { options: mergedTasks, addendum, defaultCmd };
// };

// const _getWizardOptions = () => {
//     const tasks = getRegisteredTasks();

//     console.log(
//         'DLJDLDKD:KD:LDKD',
//         Object.values(tasks).map((v) => v.key)
//     );

//     const suitableTasks: Record<string, TaskPromptOption> = {};
//     Object.values(tasks).forEach((taskInstance) => {
//         let taskObj: TaskPromptOption = _getTaskOption(_getTaskObj(taskInstance));
//         if (!suitableTasks[taskObj.value.taskName]) {
//             suitableTasks[taskObj.value.taskName] = taskObj;
//         } else {
//             // In case of multiple competing tasks (same task name but coming from different engines)

//             taskObj = suitableTasks[taskObj.value.taskName];
//             if (!taskObj.subTasks) {
//                 taskObj.subTasks = [
//                     {
//                         ...taskObj,
//                     },
//                 ];
//             }
//             taskObj.subTasks.push(taskObj);
//             // We try to revert to generic description instead.
//             taskObj.name = `${taskObj.value}...`;
//             taskObj.description = DEFAULT_TASK_DESCRIPTIONS[taskObj.value.taskName] || taskObj.description;
//             // In case of multiple competing tasks we assume they are "commonly used"
//             taskObj.isPriorityOrder = true;
//             if (taskInstance.ownerID) {
//                 taskObj.providers.push(taskInstance.ownerID);
//             }
//             taskObj.value.subTsks = taskObj.subTasks;
//         }
//     });
//     return Object.values(suitableTasks);
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

// const _getTaskOption = ({ taskInstance }: TaskObj, provider?: string): TaskPromptOption => {
//     const asArray = taskInstance.task.split(' ');
//     const output: TaskPromptOption = {
//         value: { taskName: taskInstance.task },
//         command: '',
//         name: ``,
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
