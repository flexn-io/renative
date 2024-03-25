import { RnvTaskFn, logTask, RnvTaskOptionPresets, executeTask, shouldSkipTask, RnvTask, RnvTaskName } from '@rnv/core';
import { configureNextIfRequired } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    if (c.program.opts().only && !!parentTask) {
        return true;
    }

    return configureNextIfRequired();
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
