import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    shouldSkipTask,
    executeOrSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { exportWebNext } from '../sdk';

const taskExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(RnvTaskName.export, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            return exportWebNext();
        default:
            logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskExport,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
