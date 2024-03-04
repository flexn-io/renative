import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { configureNextIfRequired } from '../sdk';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(c, RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

    if (shouldSkipTask(c, RnvTaskName.configure, originTask)) return true;

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
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
