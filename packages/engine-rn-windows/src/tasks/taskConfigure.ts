import {
    copySharedPlatforms,
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    configureEntryPoint,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { configureWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;
    await configureEntryPoint(c.platform);

    await copySharedPlatforms();

    if (c.program.opts().only && !!parentTask) {
        return true;
    }

    return configureWindowsProject(c);
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
