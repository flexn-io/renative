import {
    inquirerPrompt,
    logTask,
    logRaw,
    getWorkspaceConnectionString,
    executeTask,
    TASK_WORKSPACE_CONNECT,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    RnvTask,
} from '@rnv/core';

export const taskRnvWorkspaceConnect: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvWorkspaceConnect');

    if (!c.paths.project.configExists) {
        return Promise.reject(`${TASK_PROJECT_CONFIGURE} not supported outside of renative project`);
    }
    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_WORKSPACE_CONNECT, originTask);

    const cnf = c.files.rnv.configWorkspaces;
    if (!cnf) return;

    const opts = Object.keys(cnf.workspaces).map((v) => `${v} ${getWorkspaceConnectionString(cnf.workspaces[v])}`);

    const { selectedWS } = await inquirerPrompt({
        type: 'list',
        name: 'selectedWS',
        message: 'Pick a workspace',
        choices: opts,
    });

    logRaw(selectedWS);
};

const Task: RnvTask = {
    description: 'Connect project with selected workspace',
    fn: taskRnvWorkspaceConnect,
    task: TASK_WORKSPACE_CONNECT,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
