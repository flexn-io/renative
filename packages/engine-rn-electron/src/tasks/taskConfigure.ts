import {
    RnvTaskFn,
    logErrorPlatform,
    copySharedPlatforms,
    logTask,
    PARAMS,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { configureElectronProject } from '../sdk';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(c, TaskKey.platformConfigure, TaskKey.configure, originTask);

    if (shouldSkipTask(c, TaskKey.configure, originTask)) return true;

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
    task: TaskKey.configure,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
