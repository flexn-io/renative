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

    await executeTask(c, RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

    if (shouldSkipTask(c, RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'macos':
        case 'windows':
        case 'linux':
            return configureElectronProject(c);
        default:
            return logErrorPlatform(c);
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
