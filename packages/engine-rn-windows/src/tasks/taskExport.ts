import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const { packageWindowsApp, clearWindowsTemporaryFiles } = SDKWindows;

const taskExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.build, TaskKey.export, originTask);

    if (shouldSkipTask(c, TaskKey.export, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            await clearWindowsTemporaryFiles(c);
            return packageWindowsApp(c);
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskExport,
    task: TaskKey.export,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
