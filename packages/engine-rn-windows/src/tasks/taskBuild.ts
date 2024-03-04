import {
    RnvTaskFn,
    executeOrSkipTask,
    logErrorPlatform,
    PARAMS,
    logTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { ruWindowsProject } from '../sdks/sdk-windows';

const taskBuild: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskBuild');
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
    fn: taskBuild,
    task: TaskKey.build,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
