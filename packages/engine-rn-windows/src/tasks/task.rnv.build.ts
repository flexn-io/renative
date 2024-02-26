import {
    RnvTaskFn,
    executeOrSkipTask,
    TASK_PACKAGE,
    TASK_BUILD,
    logErrorPlatform,
    PARAMS,
    logTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { ruWindowsProject } from '../sdks/sdk-windows';

export const taskRnvBuild: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            return ruWindowsProject(c, { release: true, launch: false, deploy: false, logging: false });
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
