import { RnvContext, getContext, inquirerPrompt, logInfo, writeFileSync } from '@rnv/core';

export const getTargetWithOptionalPrompt = async () => {
    const ctx = getContext();
    const { platform, program } = ctx;
    let target = program?.opts().target;
    const options = [];

    if (platform && !target) {
        const projectTarget = ctx.files.project.configLocal?.defaultTargets?.[platform];
        if (projectTarget) {
            options.push({ name: `${projectTarget} (project default)`, value: projectTarget });
        }
        const workspaceTarget = ctx.files.workspace.config?.defaultTargets?.[platform];
        if (workspaceTarget) {
            options.push({ name: `${workspaceTarget} (global default)`, value: workspaceTarget });
        }

        options.push({ name: 'Pick from available targets...', value: true });

        const { selectedOption } = await inquirerPrompt({
            name: 'selectedOption',
            type: 'list',
            message: 'Which target to use?',
            choices: options,
        });

        if (selectedOption) {
            target = selectedOption;
        }
    }
    return target;
};

export const updateDefaultTargets = async (c: RnvContext, selectedTarget: string) => {
    const defaultTarget = c.runtime.target;
    const { confirm } = await inquirerPrompt({
        type: 'confirm',
        name: 'confirm',
        message: `Your default target for platform ${c.platform} is ${
            !defaultTarget ? 'not defined' : `set to ${defaultTarget}`
        }. Do you want to ${!defaultTarget ? 'set' : `update `} it to ${selectedTarget} `,
    });
    if (!confirm) return;

    const workspaceConfig = c.files.workspace.config;

    if (workspaceConfig && c.platform) {
        if (!workspaceConfig.defaultTargets) workspaceConfig.defaultTargets = {};

        workspaceConfig.defaultTargets[c.platform] = selectedTarget;

        c.files.workspace.config = workspaceConfig;
        writeFileSync(c.paths.workspace.config, workspaceConfig);
    }
    logInfo(
        `Your default target for platform ${c.platform} has been updated successfully in ${c.paths.workspace.config}`
    );
};
