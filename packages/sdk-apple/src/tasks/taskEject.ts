import {
    logTask,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { ejectXcodeProject } from '../ejector';
import { SdkPlatforms } from '../common';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskEject');

    c.runtime._platformBuildsSuffix = '_eject';

    c.runtime._skipNativeDepResolutions = true;

    await executeOrSkipTask(RnvTaskName.package, RnvTaskName.eject, originTask);

    if (shouldSkipTask(RnvTaskName.eject, originTask)) return true;

    return ejectXcodeProject();
};

const Task: RnvTask = {
    description: 'Eject current ios project app to self contained native project',
    fn,
    task: RnvTaskName.eject,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
