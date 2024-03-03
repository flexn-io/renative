import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    PARAMS,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { configureXcodeProject } from '@rnv/sdk-apple';

const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TaskKey.platformConfigure, TaskKey.configure, originTask);
    if (shouldSkipTask(c, TaskKey.configure, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'macos':
            await configureXcodeProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TaskKey.configure,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos'],
};

export default Task;
