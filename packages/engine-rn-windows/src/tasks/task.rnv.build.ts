import {
    RnvTaskFn,
    executeOrSkipTask,
    TaskKey.package,
    TaskKey.build,
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

    await executeOrSkipTask(c, TaskKey.package, TaskKey.build, originTask);

    if (shouldSkipTask(c, TaskKey.build, originTask)) return true;

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
    task: TaskKey.build,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
