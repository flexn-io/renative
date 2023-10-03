import {
    RnvTaskFn,
    executeOrSkipTask,
    TASK_PACKAGE,
    TASK_BUILD,
    XBOX,
    WINDOWS,
    logErrorPlatform,
    PARAMS,
    logTask,
    shouldSkipTask,
} from '@rnv/core';
import { ruWindowsProject } from '../sdks/sdk-windows';

export const taskRnvBuild: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case XBOX:
        case WINDOWS:
            return ruWindowsProject(c, { release: true, launch: false, deploy: false, logging: false });
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};
