import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TaskKey.export,
    PARAMS,
    shouldSkipTask,
    executeOrSkipTask,
    TaskKey.build,
    RnvTask,
} from '@rnv/core';
import { exportWebNext } from '../sdk';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.build, TaskKey.export, originTask);

    if (shouldSkipTask(c, TaskKey.export, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            return exportWebNext(c);
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TaskKey.export,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
