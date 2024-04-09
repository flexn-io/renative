import { inquirerPrompt } from '../api';
import { getContext } from '../context/provider';
import { chalk, logInfo } from '../logger';
import { getRegisteredTasks } from './taskRegistry';
import { initializeTask } from './taskExecutors.js';
import { getTaskNameFromCommand, selectPlatformIfRequired } from './taskHelpers';
import { RnvTask } from './types';

type TaskOpt = {
    name: string;
    value: RnvTask;
};

const generateOptionPrompt = async (options: TaskOpt[]) => {
    const ctx = getContext();

    const { selectedTask } = await inquirerPrompt({
        type: 'autocomplete',
        source: async (_, input) => options.filter((o) => o.name.toLowerCase().includes(input?.toLowerCase() ?? '')),
        initialValue: ctx.program.args?.join(' '),
        name: 'selectedTask',
        message: `Pick a command`,
        loop: false,
        choices: options,
        pageSize: 15,
        logMessage: 'Welcome to the brave new world...',
    });

    const taskArr = selectedTask.task.split(' ');
    ctx.command = taskArr[0];
    ctx.subCommand = taskArr[1] || null;

    await selectPlatformIfRequired(selectedTask);
    return initializeTask(selectedTask);
};

export const runInteractiveWizardForSubTasks = async () => {
    const ctx = getContext();

    const tasks = getRegisteredTasks();
    const optionsMap: Record<string, TaskOpt> = {};
    const alternativeOptionsMap: Record<string, TaskOpt> = {};

    const selectedEngineID = ctx.platform && ctx.runtime.enginesByPlatform[ctx.platform]?.config?.packageName;

    Object.values(tasks).forEach((taskInstance) => {
        if (ctx.platform) {
            if (selectedEngineID && taskInstance.ownerID !== selectedEngineID) {
                // If we already specified platform we can skip tasks registered to unsupported engines
                return;
            }
            if (taskInstance.platforms && !taskInstance.platforms.includes(ctx.platform)) {
                // We can also filter out tasks that are not supported on current platform
                return;
            }
        }

        const taskCmdName = taskInstance.task.split(' ')[0];

        if (taskCmdName === ctx.command) {
            if (!optionsMap[taskInstance.task]) {
                optionsMap[taskInstance.task] = {
                    name: `${taskInstance.task} ${chalk().gray(taskInstance.description)}`,
                    value: taskInstance,
                };
            } else {
                // If multiple tasks with same name we append ... to indicate there are more options coming
                optionsMap[taskInstance.task].name = `${taskInstance.task}${chalk().gray('...')}`;
            }
        } else {
            if (!alternativeOptionsMap[taskInstance.task]) {
                alternativeOptionsMap[taskInstance.task] = {
                    name: `${taskInstance.task} ${chalk().gray(taskInstance.description)}`,
                    value: taskInstance,
                };
            } else {
                // If multiple tasks with same name we append ... to indicate there are more options coming
                alternativeOptionsMap[taskInstance.task].name = `${taskInstance.task}${chalk().gray('...')}`;
            }
        }
    });

    const options: TaskOpt[] = Object.values(optionsMap);

    if (options.length > 0) {
        if (ctx.subCommand) {
            logInfo(`No sub task named "${chalk().red(ctx.subCommand)}" found. Will look for available ones instead.`);
            ctx.subCommand = null;
        }
        return generateOptionPrompt(options);
    }

    const alternativeOptions: TaskOpt[] = Object.values(alternativeOptionsMap);
    // No subtasks found but we found closest matches
    if (alternativeOptions.length > 0) {
        return generateOptionPrompt(alternativeOptions);
    }

    if (ctx.subCommand) {
        logInfo(`No tasks found for "${chalk().red(getTaskNameFromCommand())}". Launching wizard...`);
        ctx.subCommand = null;
    }

    // If nothing could be found we resort to default wizard
    return runInteractiveWizard();
};

export const runInteractiveWizard = async () => {
    const tasks = getRegisteredTasks();

    const options: TaskOpt[] = [];

    Object.values(tasks).forEach((taskInstance) => {
        options.push({
            name: `${taskInstance.task} ${chalk().gray(taskInstance.description)}`,
            value: taskInstance,
        });
    });

    return generateOptionPrompt(options);
};
