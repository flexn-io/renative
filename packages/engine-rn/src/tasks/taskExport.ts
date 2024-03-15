import {
    logErrorPlatform,
    logTask,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { exportXcodeProject } from '@rnv/sdk-apple';

const taskExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(RnvTaskName.export, originTask)) return true;

    switch (platform) {
        case 'ios':
        case 'macos':
            return exportXcodeProject();
        case 'android':
        case 'androidtv':
        case 'androidwear':
            // Android Platforms don't need extra export step
            return true;
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskExport,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
