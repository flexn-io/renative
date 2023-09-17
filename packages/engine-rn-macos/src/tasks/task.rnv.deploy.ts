import {
    RnvTaskFn,
    logTask,
    TASK_EXPORT,
    TASK_DEPLOY,
    MACOS,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';

export const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    if (shouldSkipTask(c, TASK_DEPLOY, originTask)) return true;

    // Deploy simply triggers hook
    return true;
};

export default {
    description: 'Deploy the binary via selected deployment integeration or build hook',
    fn: taskRnvDeploy,
    task: TASK_DEPLOY,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS],
};
