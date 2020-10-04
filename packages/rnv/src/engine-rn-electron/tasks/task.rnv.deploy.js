import { logTask } from '../../core/systemManager/logger';
import { MACOS,
    WINDOWS,
    TASK_EXPORT,
    TASK_DEPLOY,
    PARAMS } from '../../core/constants';

import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    // Deploy simply trggets hook
    return true;
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: 'deploy',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
