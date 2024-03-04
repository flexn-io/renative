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

    await executeTask(c, RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(c, RnvTaskName.configure, originTask)) return true;
    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'xbox':
        case 'windows':
            return configureWindowsProject(c);
        default:
            return logErrorPlatform(c);
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
