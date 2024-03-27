import { logDefault } from '../logger';
import type { RnvTask } from './types';
import { getContext } from '../context/provider';
import { getRegisteredTasks } from './taskRegistry';
import { getTaskNameFromCommand, selectPlatformIfRequired } from './taskHelpers';

export const findSuitableTask = async (): Promise<RnvTask | undefined> => {
    logDefault('findSuitableTask');
    // const c = getContext();

    const taskName = getTaskNameFromCommand();
    if (!taskName) {
        // Trigger auto selection outside of this function
        // throw new Error('TODO interactive selection offer all tasks');
        return undefined;
    }
    const suitableTasks = findTasksByTaskName(taskName);

    const taskInstance = await extractSingleExecutableTask(suitableTasks, taskName);
    return taskInstance;
};

export const findTasksByTaskName = (taskName: string) => {
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
            if (ctx.runtime.engine && v.ownerID !== ctx.runtime.engine?.config.packageName) {
                // If we already know specific engine to be used and task is not from that engine we skip it
                return;
            }
        }

        if (v.task === taskName) {
            result.push(v);
        }
    });
    return result;
};

export const extractSingleExecutableTask = async (
    suitableTasks: RnvTask[],
    taskName: string
): Promise<RnvTask | undefined> => {
    if (suitableTasks.length === 1) {
        return suitableTasks[0];
    } else if (suitableTasks.length > 1) {
        // Found multiple Tasks with same name
        let hasPlatformAwareTasks = false;
        suitableTasks.forEach((v) => {
            if (v.platforms) {
                hasPlatformAwareTasks = true;
            }
        });
        if (hasPlatformAwareTasks) {
            // Restart the process now we defined specific platform
            await selectPlatformIfRequired();
            const newSuitableTasks = await findTasksByTaskName(taskName);
            if (newSuitableTasks.length === 0) {
                throw new Error('TODO cannot find any suitable tasks after platform selection');
            } else if (newSuitableTasks.length === 1) {
                return newSuitableTasks[0];
            }
        }

        throw new Error('TODO interactive selection multiple tasks');
    }
    // Found no tasks
    // throw new Error('TODO found no tasks');
    return undefined;
};
