import { RnvTaskFn, logErrorPlatform, logTask, PARAMS, executeTask, shouldSkipTask, RnvTask, TaskKey } from '@rnv/core';
import { configureNextIfRequired } from '../sdk';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

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
    fn: taskConfigure,
    task: TaskKey.configure,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
