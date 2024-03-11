import {
    RnvTaskFn,
    executeOrSkipTask,
    logErrorPlatform,
    RnvTaskOptionPresets,
    logTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { ruWindowsProject } from '../sdks/sdk-windows';

const taskBuild: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskBuild');
    const { platform } = c;

    await executeOrSkipTask(c, RnvTaskName.package, RnvTaskName.build, originTask);

    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            return ruWindowsProject(c, { release: true, launch: false, deploy: false, logging: false });
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskBuild,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
