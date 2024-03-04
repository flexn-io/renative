import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { exportXcodeProject } from '@rnv/sdk-apple';

const taskExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(c, RnvTaskName.export, originTask)) return true;

    switch (platform) {
        case 'macos':
            return exportXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskExport,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos'],
};

export default Task;
