import {
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { clearWindowsTemporaryFiles, packageWindowsApp } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);

    await executeOrSkipTask(RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(RnvTaskName.export, originTask)) return true;
    await clearWindowsTemporaryFiles(c);
    return packageWindowsApp(c);
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
