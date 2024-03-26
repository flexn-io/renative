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
    copyRuntimeAssets,
    cleanPlaformAssets,
    versionCheck,
    configureEngines,
    executeTask,
    initializeTask,
    findSuitableTask,
    RnvTaskFn,
    generatePlatformAssetsRuntimeConfig,
    RnvTask,
    generateLocalJsonSchemas,
    RnvTaskName,
    getContext,
    // parseRenativeConfigs,
    // parseAppConfigs,
    // loadFileExtended,
} from '@rnv/core';
import { checkCrypto } from '../crypto/common';
import { installPackageDependenciesAndPlugins } from '../../plugins';
import { configureFonts } from '@rnv/sdk-utils';

const checkIsRenativeProject = async () => {
    const c = getContext();
    if (!c.paths.project.configExists) {
        return Promise.reject(
            `This directory is not ReNative project. Project config ${chalk().bold(
                c.paths.project.config
            )} is missing!. You can create new project with ${chalk().bold('rnv new')}`
        );
    }
    return true;
};

const configurePlatformBuilds = async () => {
    const c = getContext();
    if (c.paths.project.builds.dir && !fsExistsSync(c.paths.project.builds.dir)) {
        logInfo(`Creating folder ${c.paths.project.builds.dir} ...DONE`);
        fsMkdirSync(c.paths.project.builds.dir);
    }
};

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskProjectConfigure');

    await configurePlatformBuilds();
    await checkAndMigrateProject();
    await updateRenativeConfigs();
    await checkIsRenativeProject();
    await generateLocalJsonSchemas();

    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.projectConfigure, originTask);

    if (c.program.opts().only && !!parentTask) {
        await configureRuntimeDefaults();
        await executeTask(RnvTaskName.appConfigure, RnvTaskName.projectConfigure, originTask);
        await generatePlatformAssetsRuntimeConfig();
        return true;
    }

    await checkIfTemplateConfigured();
    await executeTask(RnvTaskName.install, RnvTaskName.projectConfigure, originTask);
    if (originTask !== RnvTaskName.cryptoDecrypt) {
        //If we explicitly running rnv crypto decrypt there is no need to check crypto
        await checkCrypto(parentTask, originTask);
    }

    await configureRuntimeDefaults();

    if (originTask !== RnvTaskName.templateApply) {
        if ((c.runtime.requiresBootstrap || !isTemplateInstalled()) && !c.buildConfig?.isTemplate) {
            await applyTemplate();
            // We'll have to install the template first and reset current engine
            logInfo('Your template has been bootstraped. Command reset is required. RESTRATING...DONE');

            const taskInstance = await findSuitableTask();
            c.runtime.requiresBootstrap = false;
            if (taskInstance?.task) {
                return initializeTask(taskInstance);
            }
        }
        await applyTemplate();
        // We need to ensure appConfigs are populated from template before proceeding further
        await configureTemplateFiles();
        await configureRuntimeDefaults();
        await executeTask(RnvTaskName.install, RnvTaskName.projectConfigure, originTask);
        await executeTask(RnvTaskName.appConfigure, RnvTaskName.projectConfigure, originTask);
        // IMPORTANT: configurePlugins must run after appConfig present to ensure merge of all configs/plugins
        await versionCheck(c);
        await configureEngines(c);
        await resolvePluginDependants();
        await configurePlugins();

        await configureRuntimeDefaults();
        if (!c.runtime.disableReset) {
            if (c.program.opts().resetHard) {
                logInfo(
                    `You passed ${chalk().bold('-R, --resetHard')} argument. "${chalk().bold(
                        './platformAssets'
                    )}" will be cleaned up first`
                );
                await cleanPlaformAssets();
            } else if (c.program.opts().resetAssets) {
                logInfo(
                    `You passed ${chalk().bold('-a, --resetAssets')} argument. "${chalk().bold(
                        './platformAssets'
                    )}" will be cleaned up first`
                );
                await cleanPlaformAssets();
            }
        }

        await copyRuntimeAssets();
        // Moved this up stream to ensure all configs are ready before copyRuntimeAssets
        // await configureTemplateFiles();

        if (!c.buildConfig.platforms) {
            await updateRenativeConfigs();
        }
        await generatePlatformAssetsRuntimeConfig();
        await overrideTemplatePlugins();
        // NOTE: this is needed to ensure missing rnv plugin sub-deps are caught
        await checkForPluginDependencies(async () => {
            await installPackageDependenciesAndPlugins();
        });
        await configureFonts();
    }

    return true;
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: async () => {},
    task: RnvTaskName.projectConfigure,
};

export default Task;
