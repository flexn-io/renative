import { logTask } from '../core/systemManager/logger';
// import { executeTask } from '../core/engineManager';
// import { TASK_WORKSPACE_UPDATE, TASK_PROJECT_CONFIGURE } from '../core/constants';

export const taskRnvWorkspaceConfigure = async () => {
    logTask('taskRnvWorkspaceConfigure');


    return true;
};

export default {
    description: '',
    fn: taskRnvWorkspaceConfigure,
    task: 'workspace configure',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
