import {
    RnvTaskFn,
    copySharedPlatforms,
    logTask,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { configureElectronProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c.platform);

    await copySharedPlatforms();

    if (c.program.only && !!parentTask) {
        return true;
    }

    return configureElectronProject();
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
