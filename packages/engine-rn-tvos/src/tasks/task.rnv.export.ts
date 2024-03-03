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
import { exportXcodeProject } from '@rnv/sdk-apple';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.build, TaskKey.export, originTask);

    if (shouldSkipTask(c, TaskKey.export, originTask)) return true;

    switch (platform) {
        case 'androidtv':
        case 'firetv':
            // Android Platforms don't need extra export step
            return true;
        case 'tvos':
            return exportXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TaskKey.export,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
