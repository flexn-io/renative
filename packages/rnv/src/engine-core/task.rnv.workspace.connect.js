import { inquirerPrompt } from '../cli/prompt';
import { logTask, logRaw } from '../core/systemManager/logger';
import { getWorkspaceConnectionString } from '../core/projectManager/workspace';
import { executeTask } from '../core/engineManager';
import { TASK_WORKSPACE_CONNECT, TASK_PROJECT_CONFIGURE } from '../core/constants';

export const taskRnvWorkspaceConnect = async (c, parentTask, originTask) => {
    logTask('taskRnvWorkspaceConnect', `parent:${parentTask} origin:${originTask}`);

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_CONNECT, originTask);

    const opts = Object.keys(c.files.rnv.configWorkspaces?.workspaces).map(
        v => `${v} ${getWorkspaceConnectionString(
                c.files.rnv.configWorkspaces?.workspaces[v]
        )}`
    );

    const { selectedWS } = await inquirerPrompt({
        type: 'list',
        name: 'selectedWS',
        message: 'Pick a workspace',
        choices: opts
    });

    logRaw(selectedWS);
};

export default {
    description: '',
    fn: taskRnvWorkspaceConnect,
    task: TASK_WORKSPACE_CONNECT,
    params: [],
    platforms: [],
};
