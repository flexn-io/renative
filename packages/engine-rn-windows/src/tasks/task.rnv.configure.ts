import {
    logErrorPlatform,
    copySharedPlatforms,
    logTask,
    WINDOWS,
    XBOX,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    configureEntryPoint,
    executeTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

const { configureWindowsProject } = SDKWindows;

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;
    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case XBOX:
        case WINDOWS:
            return configureWindowsProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};

export default Task;
