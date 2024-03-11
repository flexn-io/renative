import {
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const { packageWindowsApp, clearWindowsTemporaryFiles } = SDKWindows;

const taskExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(RnvTaskName.export, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            await clearWindowsTemporaryFiles(c);
            return packageWindowsApp(c);
        default:
            logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskExport,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
