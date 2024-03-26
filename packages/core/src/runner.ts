import { getContext } from './context/provider';
import { loadEngines, registerMissingPlatformEngines } from './engines';
import { loadIntegrations } from './integrations';
import { checkAndMigrateProject } from './migrator';
import { configureRuntimeDefaults } from './context/runtime';
import { findSuitableTask, initializeTask } from './tasks';
import { updateRenativeConfigs } from './plugins';
import { checkAndBootstrapIfRequired } from './projects/bootstrap';
import { loadDefaultConfigTemplates } from './configs';
import { getApi } from './api/provider';
import { RnvTask } from './tasks/types';

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

    await loadIntegrations();
    const result = await loadEngines();
    // If false make sure we reload configs as it means it's freshly installed
    if (!result) {
        await updateRenativeConfigs();
    }
    // for root rnv we simply load all engines upfront
    const { configExists } = c.paths.project;
    if (!c.command && configExists) {
        await registerMissingPlatformEngines();
    }

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
