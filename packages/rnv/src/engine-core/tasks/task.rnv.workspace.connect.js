import { inquirerPrompt } from '../../cli/prompt';
import { logTask, logRaw } from '../../core/systemManager/logger';
import { getWorkspaceConnectionString } from '../../core/projectManager/workspace';
import { executeTask } from '../../core/taskManager';
import { TASK_WORKSPACE_CONNECT, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';

export const taskRnvWorkspaceConnect = async (c, parentTask, originTask) => {
    logTask('taskRnvWorkspaceConnect');

    if (!c.paths.project.configExists) {
        return Promise.reject(`${TASK_PROJECT_CONFIGURE} not supported outside of renative project`);
    }
    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_CONNECT, originTask);

    const opts = Object.keys(c.files.rnv.configWorkspaces?.workspaces).map(
        (v) => `${v} ${getWorkspaceConnectionString(c.files.rnv.configWorkspaces?.workspaces[v])}`
    );

    const { selectedWS } = await inquirerPrompt({
        type: 'list',
        name: 'selectedWS',
        message: 'Pick a workspace',
        choices: opts,
    });

    logRaw(selectedWS);
};

export default {
    description: 'Connect project with selected workspace',
    fn: taskRnvWorkspaceConnect,
    task: TASK_WORKSPACE_CONNECT,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};
