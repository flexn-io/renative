import { getContext } from './context/provider';
import { loadEngines, registerMissingPlatformEngines } from './engines';
import { loadIntegrations } from './integrations';
import { checkAndMigrateProject } from './migrator';
import { configureRuntimeDefaults } from './context/runtime';
import { findSuitableTask } from './tasks/taskFinder';
import { updateRenativeConfigs } from './plugins';
import { checkAndBootstrapIfRequired } from './projects/bootstrap';
import { loadDefaultConfigTemplates } from './configs';
import { getApi } from './api/provider';
import { RnvTask } from './tasks/types';
import { runInteractiveWizard, runInteractiveWizardForSubTasks } from './tasks/wizard';
import { initializeTask } from './tasks/taskExecutors';

export const exitRnvCore = async (code: number) => {
    const ctx = getContext();
    const api = getApi();

    if (ctx.process) {
        api.analytics.teardown().then(() => {
            ctx.process.exit(code);
        });
    }
};

const loadAllEngineTasks = async () => {
    const result = await loadEngines();
    // If false make sure we reload configs as it means it's freshly installed
    if (!result) {
        await updateRenativeConfigs();
    }
    await registerMissingPlatformEngines();
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

    // for "rnv" we simply load all engines upfront
    const { configExists } = c.paths.project;
    if (!c.command && configExists) {
        await loadAllEngineTasks();
        await loadIntegrations();
        return runInteractiveWizard();
    }

    let initTask: RnvTask | undefined;

    // Special Case for engine-core tasks
    // they don't require other engines to be loaded if isGlobalScope = true
    // ie rnv link
    initTask = await findSuitableTask();
    if (initTask) {
        return initializeTask(initTask);
    }

    // Next we load all integrations and see if there is a task that matches
    await loadIntegrations();
    initTask = await findSuitableTask();
    if (initTask) {
        return initializeTask(initTask);
    }

    // Still no task found. time to load all engines to see if anything matches
    await loadAllEngineTasks();
    initTask = await findSuitableTask();
    if (initTask) {
        return initializeTask(initTask);
    }

    // Still no task found. time to check sub tasks options via wizard
    return runInteractiveWizardForSubTasks();
};
