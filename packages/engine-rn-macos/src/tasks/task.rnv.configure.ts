import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    MACOS,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
} from '@rnv/core';
import { configureXcodeProject } from '@rnv/sdk-apple';

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case MACOS:
            await configureXcodeProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS],
};

export default Task;
