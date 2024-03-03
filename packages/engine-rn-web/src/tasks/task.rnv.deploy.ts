import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TaskKey.export,
    TaskKey.deploy,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { deployWeb } from '@rnv/sdk-webpack';

export const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.export, TaskKey.deploy, originTask);

    if (shouldSkipTask(c, TaskKey.deploy, originTask)) return true;

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
    task: TaskKey.deploy,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
