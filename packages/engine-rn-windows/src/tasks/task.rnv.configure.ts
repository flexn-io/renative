import {
    logErrorPlatform,
    copySharedPlatforms,
    logTask,
    TaskKey.platformConfigure,
    TaskKey.configure,
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

    await executeTask(c, TaskKey.platformConfigure, TaskKey.configure, originTask);
    if (shouldSkipTask(c, TaskKey.configure, originTask)) return true;
    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'xbox':
        case 'windows':
            return configureWindowsProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TaskKey.configure,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
