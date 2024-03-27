import { getContext } from './context/provider';
import { loadEngines } from './engines';
import { loadIntegrations } from './integrations';
import { checkAndMigrateProject } from './migrator';
import { configureRuntimeDefaults } from './context/runtime';
import { findSuitableTask, initializeTask } from './tasks';
import { updateRenativeConfigs } from './plugins';
import { checkAndBootstrapIfRequired } from './projects/bootstrap';
import { loadDefaultConfigTemplates } from './configs';
import { getApi } from './api/provider';
import { RnvTask } from './tasks/types';
import { inquirerPrompt } from './api';
import { getTaskNameFromCommand } from './tasks/taskHelpers';

export const exitRnvCore = async (code: number) => {
    const ctx = getContext();
    const api = getApi();

    if (ctx.process) {
        api.analytics.teardown().then(() => {
            ctx.process.exit(code);
        });
    }
};

export const executeRnvCore = async () => {
    const c = getContext();

    await loadDefaultConfigTemplates();
    await configureRuntimeDefaults();
    await checkAndMigrateProject();
    await updateRenativeConfigs();
    await checkAndBootstrapIfRequired();

    // TODO: rename to something more meaningful or DEPRECATE entirely
    if (c.program.opts().npxMode) {
        return;
    }

    let initTask: RnvTask | undefined;

    // Special Case for engine-core tasks
    // they don't require other engines to be loaded if isGlobalScope = true
    // ie rnv link
    initTask = await findSuitableTask();
    if (initTask?.isGlobalScope) {
        return initializeTask(initTask);
    }

    // Next we load all integrations and see if there is a task that matches
    await loadIntegrations();
    initTask = await findSuitableTask();
    if (initTask) {
        return initializeTask(initTask);
    }

    // Engines are bound to platform
    // If we don't know the platform yet we need to load all engines
    c.runtime.availablePlatforms = c.buildConfig.defaults?.supportedPlatforms || [];
    if (!c.platform) {
        const taskName = getTaskNameFromCommand();
        const platforms = c.runtime.availablePlatforms;
        if (platforms) {
            if (platforms.length === 1) {
                c.platform = platforms[0];
            } else {
                const { platform } = await inquirerPrompt({
                    type: 'list',
                    name: 'platform',
                    message: `Pick a platform for ${taskName}`,
                    choices: platforms,
                });
                c.platform = platform;
            }
        }
    }

    const result = await loadEngines();
    // If false make sure we reload configs as it means it's freshly installed
    if (!result) {
        await updateRenativeConfigs();
    }

    // for root rnv we simply load all engines upfront
    // const { configExists } = c.paths.project;
    // if (!c.command && configExists) {
    // }

    initTask = await findSuitableTask();
    return initializeTask(initTask);

    // if (c.command && !taskInstance?.ignoreEngines) {
    //     await registerMissingPlatformEngines(taskInstance);
    // }

    // if (taskInstance?.task) {
    //     return initializeTask(taskInstance);
    // }
    // return Promise.reject(`No suitable task found for command: ${c.command}`);
};
