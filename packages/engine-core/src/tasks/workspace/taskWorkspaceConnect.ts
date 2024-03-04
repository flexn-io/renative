import {
    inquirerPrompt,
    logTask,
    logRaw,
    getWorkspaceConnectionString,
    executeTask,
    PARAMS,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskWorkspaceConnect: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskWorkspaceConnect');

    if (!c.paths.project.configExists) {
        return Promise.reject(`${TaskKey.projectConfigure} not supported outside of renative project`);
    }
    await executeTask(c, TaskKey.projectConfigure, TaskKey.workspaceConnect, originTask);

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
    fn: taskWorkspaceConnect,
    task: TaskKey.workspaceConnect,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
