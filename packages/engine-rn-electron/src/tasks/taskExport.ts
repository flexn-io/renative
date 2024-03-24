import {
    RnvTaskFn,
    logTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { exportElectron } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);

    await executeOrSkipTask(RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(RnvTaskName.export, originTask)) return true;

    return exportElectron();
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
