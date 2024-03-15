import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { configureXcodeProject } from '@rnv/sdk-apple';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'macos':
            await configureXcodeProject();
            return true;
        default:
            await logErrorPlatform();
            return true;
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskConfigure,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos'],
};

export default Task;
