import {
    checkForPluginDependencies,
    configurePlugins,
    overrideTemplatePlugins,
    resolvePluginDependants,
    chalk,
    logTask,
    logInfo,
    updateRenativeConfigs,
    configureRuntimeDefaults,
    applyTemplate,
    checkIfTemplateConfigured,
    configureTemplateFiles,
    isTemplateInstalled,
    fsExistsSync,
    fsMkdirSync,
    checkAndMigrateProject,
    PARAMS,
    copyRuntimeAssets,
    cleanPlaformAssets,
    checkAndCreateGitignore,
    versionCheck,
    configureFonts,
    configureEngines,
    executeTask,
    initializeTask,
    findSuitableTask,
    RnvTaskFn,
    RnvContext,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
    generateLocalJsonSchemas,
    TaskKey,
} from '@rnv/core';
import { checkCrypto } from '../crypto/common';

const checkIsRenativeProject = async (c: RnvContext) => {
    if (!c.paths.project.configExists) {
        return Promise.reject(
            `This directory is not ReNative project. Project config ${chalk().white(
                c.paths.project.config
            )} is missing!. You can create new project with ${chalk().white('rnv new')}`
        );
    }
    return true;
};

const configurePlatformBuilds = async (c: RnvContext) => {
    if (c.paths.project.builds.dir && !fsExistsSync(c.paths.project.builds.dir)) {
        logInfo(`Creating folder ${c.paths.project.builds.dir} ...DONE`);
        fsMkdirSync(c.paths.project.builds.dir);
    }
};

export const taskRnvProjectConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvProjectConfigure');

    await configurePlatformBuilds(c);
    await checkAndMigrateProject();
    await updateRenativeConfigs(c);
    await checkIsRenativeProject(c);
    await generateLocalJsonSchemas();

    await executeTask(c, TaskKey.workspaceConfigure, TaskKey.projectConfigure, originTask);

    if (c.program.only && !!parentTask) {
        await configureRuntimeDefaults(c);
        await executeTask(c, TaskKey.appConfigure, TaskKey.projectConfigure, originTask);
        await generatePlatformAssetsRuntimeConfig(c);
        return true;
    }

    await checkIfTemplateConfigured(c);
    await executeTask(c, TaskKey.install, TaskKey.projectConfigure, originTask);
    if (originTask !== TaskKey.cryptoDecrypt) {
        //If we explicitly running rnv crypto decrypt there is no need to check crypto
        await checkCrypto(c, parentTask, originTask);
    }

    await configureRuntimeDefaults(c);

    if (originTask !== TaskKey.templateApply) {
        if ((c.runtime.requiresBootstrap || !isTemplateInstalled(c)) && !c.files.project.config?.isTemplate) {
            await applyTemplate(c);
            // We'll have to install the template first and reset current engine
            logInfo('Your template has been bootstraped. Command reset is required. RESTRATING...DONE');

            const taskInstance = await findSuitableTask(c);
            c.runtime.requiresBootstrap = false;
            if (taskInstance?.task) {
                return initializeTask(c, taskInstance?.task);
            }
        }
        await applyTemplate(c);
        await configureRuntimeDefaults(c);
        await executeTask(c, TaskKey.install, TaskKey.projectConfigure, originTask);
        await executeTask(c, TaskKey.appConfigure, TaskKey.projectConfigure, originTask);
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
        if (!c.buildConfig.platforms) {
            await updateRenativeConfigs(c);
        }
        await generatePlatformAssetsRuntimeConfig(c);
        await overrideTemplatePlugins(c);
        // NOTE: this is needed to ensure missing rnv plugin sub-deps are caught
        await checkForPluginDependencies(c);
        await configureFonts(c);
    }

    return true;
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvProjectConfigure,
    task: TaskKey.projectConfigure,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
