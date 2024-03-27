import { logDefault, logInitTask, logExitTask, chalk, logRaw, logInfo } from '../logger';
import { executePipe } from '../buildHooks';
import type { RnvContext } from '../context/types';
import type { RnvTask } from './types';
import { getApi } from '../api/provider';
import { checkIfProjectAndNodeModulesExists } from '../projects/dependencies';
import { getContext } from '../context/provider';
import { RnvTaskName } from '../enums/taskName';
import { generateStringFromTaskOption, shouldSkipTask } from './taskHelpers';
import { getEngineRunnerByOwnerID } from '../engines';
import { extractSingleExecutableTask, findTasksByTaskName } from './taskFinder';

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
        const availableTasks = findTasksByTaskName(alternativeTaskInOnlyMode || RnvTaskName.configureSoft);
        const taskInstance = await extractSingleExecutableTask(availableTasks, taskName);
        return _executeTaskInstance({ taskInstance, parentTaskName, originTaskName, isOptional, isFirstTask });
    }

    const availableTasks = findTasksByTaskName(taskName);
    const taskInstance = await extractSingleExecutableTask(availableTasks, taskName);
    return _executeTaskInstance({ taskInstance, parentTaskName, originTaskName, isOptional, isFirstTask });
};

export const initializeTask = async (taskInstance: RnvTask | undefined) => {
    if (!taskInstance) {
        throw new Error('Task instance is undefined');
    }
    const { task } = taskInstance;
    logDefault('initializeTask', task);
    const c = getContext();
    _populateExtraParameters(c, taskInstance);

    // If engine has not been selected by picking interactive platform selection
    // let's pick it based on task ownerID
    if (!c.runtime.engine) {
        c.runtime.engine = getEngineRunnerByOwnerID(taskInstance);
    }

    logInfo(`Current engine: ${chalk().bold(taskInstance.ownerID)} ${chalk().grey(`(${c.runtime.engine?.rootPath})`)}`);

    c.runtime.task = task;
    executedTasks = {};

    getApi().analytics.captureEvent({
        type: task,
        platform: c.platform,
    });

    await _executeTaskInstance({ taskInstance, originTaskName: task, isFirstTask: true });
    return true;
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

const _executePipe = async (taskInstance: RnvTask, phase: string) =>
    executePipe(`${taskInstance.task.split(' ').join(':')}:${phase}`);
