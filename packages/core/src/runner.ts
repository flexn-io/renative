import { getContext } from './context/provider';
import { installEngines, registerMissingPlatformEngines } from './engines';
import { loadIntegrations } from './integrations';
import { checkAndMigrateProject } from './migrator';
import { configureRuntimeDefaults } from './context/runtime';
import { findSuitableTask } from './tasks/taskFinder';
import { updateRenativeConfigs } from './plugins';
import { loadDefaultConfigTemplates } from './configs';
import { getApi } from './api/provider';
import { RnvTask } from './tasks/types';
import { runInteractiveWizard, runInteractiveWizardForSubTasks } from './tasks/wizard';
import { initializeTask } from './tasks/taskExecutors';
import { getTaskNameFromCommand, selectPlatformIfRequired } from './tasks/taskHelpers';
import { logInfo } from './logger';

export const exitRnvCore = async (code: number) => {
    const ctx = getContext();
    const api = getApi();

    if (ctx.process) {
        api.analytics.teardown().then(() => {
            ctx.process.exit(code);
        });
    }
};

const _installAndRegisterAllEngines = async () => {
    const result = await installEngines();
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
    // await checkAndBootstrapIfRequired();

    // TODO: rename to something more meaningful or DEPRECATE entirely
    if (c.program.opts().npxMode) {
        return;
    }

    // for "rnv" we simply load all engines upfront
    const { configExists } = c.paths.project;
    if (!c.command && configExists) {
        await _installAndRegisterAllEngines();
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
        if (initTask.platforms) {
            // If integration task requires platform selection
            // we do it here so correct engine is registered properly
            await selectPlatformIfRequired(initTask, true);
        }

        return initializeTask(initTask);
    }

    // Still no task found. time to load all engines to see if anything matches
    await _installAndRegisterAllEngines();
    initTask = await findSuitableTask();
    if (initTask) {
        return initializeTask(initTask);
    }

    // Still no task found. time to check sub tasks options via wizard
    logInfo(`Did not find exact match for ${getTaskNameFromCommand()}. Running interactive wizard for sub-tasks`);
    return runInteractiveWizardForSubTasks();
};
