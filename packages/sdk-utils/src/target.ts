import { getContext, inquirerPrompt } from '@rnv/core';

export const getTargetWithOptionalPrompt = async () => {
    const ctx = getContext();
    const { platform, program } = ctx;
    let target = program?.opts().target;
    const options = [];

    if (platform && !target) {
        const projectTarget = ctx.files.project.configLocal?.local?.defaultTargets?.[platform];
        if (projectTarget) {
            options.push({ name: `${projectTarget} (project default)`, value: projectTarget });
        }
        const workspaceTarget = ctx.files.workspace.config?.workspace.defaultTargets?.[platform];
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
