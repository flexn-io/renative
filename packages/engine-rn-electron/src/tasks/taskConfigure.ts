import {
    RnvTaskFn,
    logErrorPlatform,
    copySharedPlatforms,
    logTask,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { configureElectronProject } from '../sdk';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c.platform);

    await copySharedPlatforms();

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'macos':
        case 'windows':
        case 'linux':
            return configureElectronProject();
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskConfigure,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
