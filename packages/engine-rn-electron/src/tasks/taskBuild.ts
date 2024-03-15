import {
    RnvTaskFn,
    logTask,
    logErrorPlatform,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { buildElectron } from '../sdk';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.build, originTask);

    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;

    switch (platform) {
        case 'macos':
        case 'windows':
        case 'linux':
            await buildElectron();
            return;
        default:
            logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskBuild,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
