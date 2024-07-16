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
    createTask,
    generateLocalJsonSchemas,
    RnvTaskName,
    getContext,
    inquirerPrompt,
    logWarning,
} from '@rnv/core';
import { checkCrypto } from '../crypto/common';
import { checkAndInstallIfRequired, installPackageDependenciesAndPlugins } from '../../taskHelpers';
import { configureFonts } from '@rnv/sdk-utils';

const checkIsRenativeProject = async () => {
    const c = getContext();
    const { paths } = c;
    if (!paths.project.configExists) {
        return Promise.reject(
            `This directory is not ReNative project. Project config ${chalk().bold.white(
                paths.project.config
            )} is missing!. You can create new project with ${chalk().bold.white('rnv new')}`
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

const checkProjectPathSpaces = async () => {
    const c = getContext();
    const projectDir = c.paths.project.dir;
    const hasSpaces = /\s/.test(projectDir);
    if (!hasSpaces) return true;

    const warnMessage = `The project path ${chalk().bold.grey(
        projectDir
    )} contains spaces, which might cause issues with React Native and other tools. For more details, please visit: https://github.com/facebook/react-native/issues/34743.`;

    const { confirm } = await inquirerPrompt({
        type: 'confirm',
        name: 'confirm',
        message: `${warnMessage} Do you want to proceed? (yes/no)`,
    });
    if (!confirm) {
        logWarning(warnMessage, { skipSanitizePaths: true });
        return Promise.reject(`Cancelled by user.`);
    }
    logWarning(warnMessage, { skipSanitizePaths: true });
};
export default createTask({
    description: 'Configure current project',
    fn: async ({ ctx, taskName, originTaskName, parentTaskName }) => {
        const { runtime, program } = ctx;
        // if (!paths.project.configExists) {
        //     return Promise.reject(`${RnvTaskName.projectConfigure} not supported outside of renative project`);
        // }
        await checkProjectPathSpaces();
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

        await checkAndInstallIfRequired();

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
            // await configureTemplateFiles(); // NOTE: We only do this during bootstrap once
            await configureRuntimeDefaults();
            await checkAndInstallIfRequired();

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
                        `You passed ${chalk().bold.white('-R, --resetHard')} argument. "${chalk().bold.white(
                            './platformAssets'
                        )}" will be cleaned up first`
                    );
                    await cleanPlaformAssets();
                } else if (program.opts().resetAssets) {
                    logInfo(
                        `You passed ${chalk().bold.white('-a, --resetAssets')} argument. "${chalk().bold.white(
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
});
