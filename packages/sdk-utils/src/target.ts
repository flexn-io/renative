import { RnvContext, chalk, getContext, inquirerPrompt, writeFileSync } from '@rnv/core';

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

export const updateDefaultTargets = async (c: RnvContext, currentTarget: string) => {
    if (!c.platform) return;
    const localOverridden = !!c.files.project.configLocal?.defaultTargets?.[c.platform];
    const defaultTarget = c.runtime.target;
    const actionLocalUpdate = `Update ${chalk().green('project')} default target for platform ${c.platform}`;
    const actionGlobalUpdate = `Update ${chalk().green('global')}${
        localOverridden ? ` and ${chalk().green('project')}` : ''
    } default target for platform ${c.platform}`;
    const actionNoUpdate = "Don't update";

    const { chosenAction } = await inquirerPrompt({
        message: 'What to do next?',
        type: 'list',
        name: 'chosenAction',
        choices: [actionLocalUpdate, actionGlobalUpdate, actionNoUpdate],
        warningMessage: `Your default target for platform ${c.platform} is ${
            !defaultTarget ? 'not defined' : `set to ${defaultTarget}`
        }.`,
    });

    c.runtime.target = currentTarget;

    if (chosenAction === actionLocalUpdate || (chosenAction === actionGlobalUpdate && localOverridden)) {
        const configLocal = c.files.project.configLocal || {};
        if (!configLocal.defaultTargets) configLocal.defaultTargets = {};
        configLocal.defaultTargets[c.platform] = currentTarget;

        c.files.project.configLocal = configLocal;
        writeFileSync(c.paths.project.configLocal, JSON.stringify(configLocal, null, 2));
    }

    if (chosenAction === actionGlobalUpdate) {
        const configGlobal = c.files.workspace.config;
        if (configGlobal) {
            if (!configGlobal.defaultTargets) configGlobal.defaultTargets = {};
            configGlobal.defaultTargets[c.platform] = currentTarget;

            c.files.workspace.config = configGlobal;
            writeFileSync(c.paths.workspace.config, JSON.stringify(configGlobal, null, 2));
        }
    }
};
