import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { runElectron } from '../sdk';

const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.run, originTask);

    if (shouldSkipTask(c, TaskKey.run, originTask)) return true;

    switch (platform) {
        case 'macos':
        case 'windows':
        case 'linux':
            return runElectron(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Run your electron app on your machine',
    fn: taskRnvRun,
    task: TaskKey.run,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
