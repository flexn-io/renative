import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TaskKey.build,
    TaskKey.export,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { exportElectron } from '../sdk';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.build, TaskKey.export, originTask);

    if (shouldSkipTask(c, TaskKey.export, originTask)) return true;

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
    fn: taskRnvExport,
    task: TaskKey.export,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
