import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { exportElectron } from '../sdk';

const taskExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(c, RnvTaskName.export, originTask)) return true;

    switch (platform) {
        case 'macos':
        case 'windows':
        case 'linux':
            return exportElectron(c);
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskExport,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
