import {
    checkForPluginDependencies,
    configurePlugins,
    overrideTemplatePlugins,
    resolvePluginDependants,
    chalk,
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
    const { paths } = c;
    if (!paths.project.configExists) {
        return Promise.reject(
            `This directory is not ReNative project. Project config ${chalk().bold(
                paths.project.config
            )} is missing!. You can create new project with ${chalk().bold('rnv new')}`
        );
    }
    return true;
};

const configurePlatformBuilds = async () => {
    const c = getContext();
    const { paths } = c;
    if (paths.project.builds.dir && !fsExistsSync(paths.project.builds.dir)) {
        logInfo(`Creating folder ${paths.project.builds.dir} ...DONE`);
        fsMkdirSync(paths.project.builds.dir);
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: async ({ ctx, taskName, originTaskName, parentTaskName }) => {
        const { runtime, program } = ctx;
        // if (!paths.project.configExists) {
        //     return Promise.reject(`${RnvTaskName.projectConfigure} not supported outside of renative project`);
        // }

        await configurePlatformBuilds();
        await checkAndMigrateProject();
        await updateRenativeConfigs();
        await checkIsRenativeProject();
        await generateLocalJsonSchemas();

        await executeTask({ taskName: RnvTaskName.workspaceConfigure, parentTaskName: taskName, originTaskName });

        if (program.opts().only && !!parentTaskName) {
            await configureRuntimeDefaults();
            await executeTask({ taskName: RnvTaskName.appConfigure, parentTaskName: taskName, originTaskName });

            await generatePlatformAssetsRuntimeConfig();
            return true;
        }

        await checkIfTemplateConfigured();
        await executeTask({ taskName: RnvTaskName.install, parentTaskName: taskName, originTaskName });

        if (originTaskName !== RnvTaskName.cryptoDecrypt) {
            //If we explicitly running rnv crypto decrypt there is no need to check crypto
            await checkCrypto(parentTaskName, originTaskName);
        }

        await configureRuntimeDefaults();

        if (originTaskName !== RnvTaskName.templateApply) {
            if ((runtime.requiresBootstrap || !isTemplateInstalled()) && !ctx.buildConfig?.isTemplate) {
                await applyTemplate();
                // We'll have to install the template first and reset current engine
                logInfo('Your template has been bootstraped. Command reset is required. RESTRATING...DONE');

                const taskInstance = await findSuitableTask();
                runtime.requiresBootstrap = false;
                if (taskInstance?.task) {
                    return initializeTask(taskInstance);
                }
            }
            await applyTemplate();
            // We need to ensure appConfigs are populated from template before proceeding further
            await configureTemplateFiles();
            await configureRuntimeDefaults();
            await executeTask({ taskName: RnvTaskName.install, parentTaskName: taskName, originTaskName });

            await executeTask({ taskName: RnvTaskName.appConfigure, parentTaskName: taskName, originTaskName });

            // IMPORTANT: configurePlugins must run after appConfig present to ensure merge of all configs/plugins
            await versionCheck(ctx);
            await configureEngines(ctx);
            await resolvePluginDependants();
            await configurePlugins();

            await configureRuntimeDefaults();
            if (!runtime.disableReset) {
                if (program.opts().resetHard) {
                    logInfo(
                        `You passed ${chalk().bold('-R, --resetHard')} argument. "${chalk().bold(
                            './platformAssets'
                        )}" will be cleaned up first`
                    );
                    await cleanPlaformAssets();
                } else if (program.opts().resetAssets) {
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

            if (!ctx.buildConfig.platforms) {
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
    },
    task: RnvTaskName.projectConfigure,
};

export default Task;
