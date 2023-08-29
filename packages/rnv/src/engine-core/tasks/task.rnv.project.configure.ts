import {
    checkForPluginDependencies,
    configurePlugins,
    overrideTemplatePlugins,
    resolvePluginDependants,
} from '../../core/pluginManager';
import { chalk, logTask, logInfo } from '../../core/systemManager/logger';
import { checkIsRenativeProject, generateRuntimeConfig } from '../../core/configManager';
import { updateRenativeConfigs, configureRuntimeDefaults } from '../../core/runtimeManager';
import {
    applyTemplate,
    checkIfTemplateConfigured,
    configureTemplateFiles,
    isTemplateInstalled,
} from '../../core/templateManager';
import { fsExistsSync, fsMkdirSync } from '../../core/systemManager/fileutils';
import { checkCrypto } from '../../core/systemManager/crypto';
import { checkAndMigrateProject } from '../../core/projectManager/migrator';
import {
    TASK_INSTALL,
    TASK_PROJECT_CONFIGURE,
    TASK_TEMPLATE_APPLY,
    TASK_APP_CONFIGURE,
    TASK_WORKSPACE_CONFIGURE,
    PARAMS,
} from '../../core/constants';
import {
    checkAndCreateBabelConfig,
    copyRuntimeAssets,
    cleanPlaformAssets,
    checkAndCreateGitignore,
    versionCheck,
    configureFonts,
} from '../../core/projectManager';
import { configureEngines } from '../../core/engineManager';
import { executeTask, initializeTask, findSuitableTask } from '../../core/taskManager';

export const taskRnvProjectConfigure = async (c: RnvConfig, parentTask, originTask) => {
    logTask('taskRnvProjectConfigure');

    if (c.paths.project.builds.dir && !fsExistsSync(c.paths.project.builds.dir)) {
        logInfo(`Creating folder ${c.paths.project.builds.dir} ...DONE`);
        fsMkdirSync(c.paths.project.builds.dir);
    }
    await checkAndMigrateProject(c);
    await updateRenativeConfigs(c);
    await checkIsRenativeProject(c);
    // await checkAndCreateProjectPackage(c);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);

    if (c.program.only && !!parentTask) {
        await configureRuntimeDefaults(c);
        await executeTask(c, TASK_APP_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);
        await generateRuntimeConfig(c);
        return true;
    }

    await checkIfTemplateConfigured(c);
    await executeTask(c, TASK_INSTALL, TASK_PROJECT_CONFIGURE, originTask);
    await checkCrypto(c, parentTask, originTask);
    await configureRuntimeDefaults(c);

    if (originTask !== TASK_TEMPLATE_APPLY) {
        if ((c.runtime.requiresBootstrap || !isTemplateInstalled(c)) && !c.files.project.config.isTemplate) {
            await applyTemplate(c);
            // We'll have to install the template first and reset current engine
            logInfo('Your template has been bootstraped. Command reset is required. RESTRATING...DONE');

            const taskInstance = await findSuitableTask(c);
            c.runtime.requiresBootstrap = false;
            return initializeTask(c, taskInstance.task);
        }
        await applyTemplate(c);
        await configureRuntimeDefaults(c);
        await executeTask(c, TASK_INSTALL, TASK_PROJECT_CONFIGURE, originTask);
        await executeTask(c, TASK_APP_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);
        // IMPORTANT: configurePlugins must run after appConfig present to ensure merge of all configs/plugins
        await versionCheck(c);
        await configureEngines(c);
        await resolvePluginDependants(c);
        await configurePlugins(c);

        await configureRuntimeDefaults(c);
        if (!c.runtime.disableReset) {
            if (c.program.resetHard) {
                logInfo(
                    `You passed ${chalk().white('-R, --resetHard')} argument. "${chalk().white(
                        './platformAssets'
                    )}" will be cleaned up first`
                );
                await cleanPlaformAssets(c);
            } else if (c.program.resetAssets) {
                logInfo(
                    `You passed ${chalk().white('-a, --resetAssets')} argument. "${chalk().white(
                        './platformAssets'
                    )}" will be cleaned up first`
                );
                await cleanPlaformAssets(c);
            }
        }

        await copyRuntimeAssets(c);
        await configureTemplateFiles(c);
        await checkAndCreateGitignore(c);
        await checkAndCreateBabelConfig(c);
        if (!c.buildConfig.platforms) {
            await updateRenativeConfigs(c);
        }
        // NOTE: Migrated to engines
        // await configureEntryPoints(c);
        await generateRuntimeConfig(c);
        await overrideTemplatePlugins(c);
        // NOTE: this is needed to ensure missing rnv plugin sub-deps are caught
        await checkForPluginDependencies(c);
        await configureFonts(c);
    }

    return true;
};

export default {
    description: 'Configure current project',
    fn: taskRnvProjectConfigure,
    task: TASK_PROJECT_CONFIGURE,
    params: PARAMS.withBase(),
    platforms: [],
};
