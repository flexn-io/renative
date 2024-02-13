import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TIZEN,
    WEBOS,
    TASK_BUILD,
    TASK_CONFIGURE,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { buildLightningProject } from '../sdks/sdk-lightning';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case TIZEN:
        case WEBOS:
            await buildLightningProject(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TIZEN, WEBOS],
};

export default Task;
