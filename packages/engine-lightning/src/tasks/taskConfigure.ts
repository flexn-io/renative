import { logErrorPlatform, logTask, PARAMS, executeTask, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';
import { configureLightningProject } from '../sdks/sdk-lightning';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(c, TaskKey.platformConfigure, TaskKey.configure, originTask);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'tizen':
        case 'webos':
            return configureLightningProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskConfigure,
    task: TaskKey.configure,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['tizen', 'webos'],
};

export default Task;
