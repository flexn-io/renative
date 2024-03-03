import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    TaskKey.build,
    TaskKey.export,
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
        case 'ios':
        case 'macos':
            return exportXcodeProject(c);
        case 'android':
        case 'androidtv':
        case 'androidwear':
            // Android Platforms don't need extra export step
            return true;
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TaskKey.export,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
