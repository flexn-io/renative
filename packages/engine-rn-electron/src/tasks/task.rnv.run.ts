import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    MACOS,
    WINDOWS,
    LINUX,
    TASK_RUN,
    TASK_CONFIGURE,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { runElectron } from '../sdk';

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    switch (platform) {
        case MACOS:
        case WINDOWS:
        case LINUX:
            return runElectron(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Run your electron app on your machine',
    fn: taskRnvRun,
    task: TASK_RUN,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [MACOS, WINDOWS, LINUX],
};

export default Task;
