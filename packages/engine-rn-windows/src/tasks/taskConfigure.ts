import {
    logErrorPlatform,
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
import { SDKWindows } from '../sdks';

const { configureWindowsProject } = SDKWindows;

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
        case 'xbox':
        case 'windows':
            return configureWindowsProject(c);
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskConfigure,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
