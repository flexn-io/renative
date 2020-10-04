import { logTask } from '../../core/systemManager/logger';
import { executeTask } from '../../core/engineManager';
import { TASK_WORKSPACE_UPDATE, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvWorkspaceUpdate = async (c, parentTask, originTask) => {
    // TODO: taskRnvWorkspaceUpdate
    logTask('taskRnvWorkspaceUpdate');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_UPDATE, originTask);

    return true;
};

export default {
    description: '',
    fn: taskRnvWorkspaceUpdate,
    task: TASK_WORKSPACE_UPDATE,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
    isGlobalScope: true
};
