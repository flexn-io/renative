import {
    inquirerPrompt,
    logTask,
    logRaw,
    getWorkspaceConnectionString,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskWorkspaceConnect: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskWorkspaceConnect');

    if (!c.paths.project.configExists) {
        return Promise.reject(`${RnvTaskName.projectConfigure} not supported outside of renative project`);
    }
    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.workspaceConnect, originTask);

    const cnf = c.files.dotRnv.configWorkspaces;
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
    task: RnvTaskName.workspaceConnect,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
