import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TASK_EXPORT,
    PARAMS,
    shouldSkipTask,
    executeOrSkipTask,
    TASK_BUILD,
    RnvTask,
} from '@rnv/core';
import { exportWebNext } from '../sdk';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            return exportWebNext(c);
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
