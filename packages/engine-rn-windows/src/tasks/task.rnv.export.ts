import {
    logErrorPlatform,
    logTask,
    WINDOWS,
    XBOX,
    PARAMS,
    RnvTaskFn,
    TASK_BUILD,
    TASK_EXPORT,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const { packageWindowsApp, clearWindowsTemporaryFiles } = SDKWindows;

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case XBOX:
        case WINDOWS:
            await clearWindowsTemporaryFiles(c);
            return packageWindowsApp(c);
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};

export default Task;
