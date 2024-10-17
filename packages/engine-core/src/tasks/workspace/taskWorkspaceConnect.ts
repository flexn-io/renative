import { inquirerPrompt, logRaw, getWorkspaceConnectionString, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Connect project with selected workspace',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const cnf = ctx.files.dotRnv.configWorkspaces;
        if (!cnf?.workspaces) return;

        const opts = Object.keys(cnf.workspaces).map((v) => `${v} ${getWorkspaceConnectionString(cnf.workspaces[v])}`);

        const { selectedWS } = await inquirerPrompt({
            type: 'list',
            name: 'selectedWS',
            message: 'Pick a workspace',
            choices: opts,
        });

        logRaw(selectedWS);
    },
    task: RnvTaskName.workspaceConnect,
    isGlobalScope: true,
});
