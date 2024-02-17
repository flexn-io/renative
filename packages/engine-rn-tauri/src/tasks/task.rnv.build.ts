import {
    RnvTaskFn,
    logTask,
    MACOS,
    WINDOWS,
    LINUX,
    TASK_BUILD,
    TASK_PACKAGE,
    PARAMS,
    logErrorPlatform,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { buildElectron } from '../sdk';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case MACOS:
        case WINDOWS:
        case LINUX:
            await buildElectron(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS, WINDOWS, LINUX],
};

export default Task;
