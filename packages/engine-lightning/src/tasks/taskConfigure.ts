import { logTask, executeTask, RnvTaskFn, RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { configureLightningProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

    if (c.program.only && !!parentTask) {
        return true;
    }
    return configureLightningProject();
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
