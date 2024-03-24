import {
    RnvTaskFn,
    executeOrSkipTask,
    RnvTaskOptionPresets,
    logTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { ruWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskBuild');

    await executeOrSkipTask(RnvTaskName.package, RnvTaskName.build, originTask);
    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;
    return ruWindowsProject(c, { release: true, launch: false, deploy: false, logging: false });
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
