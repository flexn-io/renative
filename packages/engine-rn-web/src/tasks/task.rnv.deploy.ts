import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TASK_EXPORT,
    TASK_DEPLOY,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { deployWeb } from '@rnv/sdk-webpack';

export const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    if (shouldSkipTask(c, TASK_DEPLOY, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'webtv':
        case 'chromecast':
            return deployWeb();
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TASK_DEPLOY,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
