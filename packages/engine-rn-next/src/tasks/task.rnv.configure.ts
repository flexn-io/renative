import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TaskKey.platformConfigure,
    TaskKey.configure,
    PARAMS,
    executeTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { configureNextIfRequired } from '../sdk';

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TaskKey.platformConfigure, TaskKey.configure, originTask);

    if (shouldSkipTask(c, TaskKey.configure, originTask)) return true;

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'web':
        case 'chromecast':
            return configureNextIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TaskKey.configure,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
