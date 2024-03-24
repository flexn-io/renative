import {
    logTask,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { ejectGradleProject } from '../ejector';
import { SdkPlatforms } from '../constants';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskEject');

    c.runtime._platformBuildsSuffix = '_eject/android';
    c.runtime._skipNativeDepResolutions = true;

    await executeOrSkipTask(RnvTaskName.package, RnvTaskName.eject, originTask);

    if (shouldSkipTask(RnvTaskName.eject, originTask)) return true;

    await ejectGradleProject();
};

const Task: RnvTask = {
    description: 'Eject current project app to self contained native project',
    fn,
    task: RnvTaskName.eject,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
