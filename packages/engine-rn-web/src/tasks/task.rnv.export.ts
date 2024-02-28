import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TASK_BUILD,
    TASK_EXPORT,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { exportWeb } from '@rnv/sdk-webpack';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case 'web':
            return exportWeb();
        case 'tizen':
        case 'tizenwatch':
        case 'tizenmobile':
        case 'webos':
        case 'kaios':
        case 'webtv':
        case 'chromecast':
            return true;
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
