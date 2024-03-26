import { RnvTask, RnvTaskMap } from './types';

const REGISTERED_TASKS: RnvTaskMap = {};

export const registerRnvTask = async (taskInstance: RnvTask) => {
    if (!taskInstance.key) {
        throw new Error('Task key is required');
    }
    if (taskInstance.key in REGISTERED_TASKS) {
        throw new Error(`Task key must be unique. Task with key ${taskInstance.key} already exists`);
    }
    REGISTERED_TASKS[taskInstance.key] = taskInstance;
};

export const getRegisteredTasks = () => REGISTERED_TASKS;
