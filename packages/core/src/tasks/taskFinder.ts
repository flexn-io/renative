import { logDefault, logWarning } from '../logger';
import type { RnvTask } from './types';
import { getContext } from '../context/provider';
import { getRegisteredTasks } from './taskRegistry';
import { getTaskNameFromCommand, selectPlatformIfRequired } from './taskHelpers';
import { inquirerPrompt } from '../api';

export const findSuitableTask = async (): Promise<RnvTask | undefined> => {
    logDefault('findSuitableTask');
    const taskName = getTaskNameFromCommand();
    if (!taskName) {
        // Trigger auto selection outside of this function
        return undefined;
    }
    const suitableTasks = findTasksByTaskName(taskName);

    const taskInstance = await extractSingleExecutableTask(suitableTasks.match, taskName);
    return taskInstance;
};

export const findTasksByTaskName = (taskName: string) => {
    const result: RnvTask[] = [];
    const ctx = getContext();
    const tasks = getRegisteredTasks();
    const taskArr = Object.values(tasks);
    taskArr.forEach((v) => {
        const plat = ctx.platform;

        if (v.platforms && typeof plat === 'string') {
            if (!v.platforms.includes(plat)) {
                // If we found a task with platform restriction and it does not match current platform we skip it
                return;
            }
            if (ctx.runtime.engine && v.ownerID !== ctx.runtime.engine?.config?.name) {
                // If we already know specific engine to be used and task is not from that engine we skip it
                return;
            }
        }
        if (v.task === taskName) {
            result.push(v);
        }
    });
    return { match: result, available: taskArr };
};

export const extractSingleExecutableTask = async (
    suitableTasks: RnvTask[],
    taskName: string
): Promise<RnvTask | undefined> => {
    let hasPlatformAwareTasks = false;
    suitableTasks.forEach((v) => {
        if (v.platforms) {
            hasPlatformAwareTasks = true;
        }
    });
    if (!hasPlatformAwareTasks && suitableTasks.length === 1) {
        return suitableTasks[0];
    }

    // Restart the process now we defined specific platform
    await selectPlatformIfRequired();
    const newSuitableTasks = await findTasksByTaskName(taskName);

    if (newSuitableTasks.match.length === 0) {
        logWarning('No suitable tasks found after platform selection');
        // throw new Error('TODO cannot find any suitable tasks after platform selection');
    } else if (newSuitableTasks.match.length === 1) {
        return newSuitableTasks.match[0];
    } else if (newSuitableTasks.match.length > 1) {
        // Found multiple Tasks with same name
        logWarning(`Multiple competing tasks found for ${taskName} task. Please select one:`);
        const { result } = await inquirerPrompt({
            type: 'list',
            name: 'result',
            message: 'Select task',
            choices: newSuitableTasks.match.map((v) => ({
                name: `${v.task} - registered to: ${v.ownerID}`,
                value: v,
            })),
        });
        return result;
    }
    // Found no tasks
    return undefined;
};
