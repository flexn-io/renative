import {
    logErrorPlatform,
    logTask,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { configureLightningProject } from '../sdks/sdk-lightning';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(c, RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);

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
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['tizen', 'webos'],
};

export default Task;
