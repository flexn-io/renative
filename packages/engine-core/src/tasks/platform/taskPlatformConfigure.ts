import {
    chalk,
    logTask,
    logInfo,
    fsExistsSync,
    getAppFolder,
    cleanPlatformBuild,
    createPlatformBuild,
    configureRuntimeDefaults,
    executeTask,
    createTask,
    RnvTaskName,
    // installPackageDependencies,
    // overrideTemplatePlugins,
    resolveEngineDependencies,
    logWarning,
    getConfigProp,
} from '@rnv/core';
import { isBuildSchemeSupported } from '../../buildSchemes';
import path from 'path';
import { checkAndInstallIfRequired } from '../../taskHelpers';
// import { configureFonts } from '@rnv/sdk-utils';

/**
 * CLI command `npx rnv project configure` triggers this task to prepare the platformBuilds folder.
 * This task is private and is a dependency of the projectConfigure task.
 * Functionality:
 * - Validates if the build scheme is supported.
 * - Retrieves the entry file configuration property.
 * - Checks if the destination file exists, and logs a warning if the entry file key is missing.
 * - Executes the sdkConfigure task optionally.
 * - Configures runtime defaults and checks for necessary installations.
 * - Logs the presence of the build folder.
 * - Cleans the platform build if reset options are provided and reset is not disabled.
 * - Creates the platform build and resolves engine dependencies.
 *
 * @returns {Promise<boolean>} - Returns true upon successful execution of the task.
 */
export default createTask({
    description: 'Low-level task used by engines to prepare platformBuilds folder',
    isPrivate: true,
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx, taskName, originTaskName }) => {
        const { program, platform } = ctx;
        await isBuildSchemeSupported();

        const entryFile = getConfigProp('entryFile');

        const dest = path.join(ctx.paths.project.dir, `${entryFile}.js`);
        if (!fsExistsSync(dest) && platform) {
            if (!entryFile) {
                logWarning(
                    `Missing ${chalk().red(entryFile)} key for ${chalk().bold.white(
                        ctx.platform
                    )} platform in your ${chalk().bold.white(ctx.paths.appConfig.config)}.`
                );
            }
        }

        await executeTask({
            taskName: RnvTaskName.sdkConfigure,
            parentTaskName: taskName,
            originTaskName,
            isOptional: true,
        });

        await configureRuntimeDefaults();
        await checkAndInstallIfRequired();

        const hasBuild = fsExistsSync(ctx.paths.project.builds.dir);
        logTask('', `taskPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

        if ((program.opts().reset || program.opts().resetHard) && !ctx.runtime.disableReset) {
            logInfo(
                `You passed ${chalk().bold.white(program.opts().reset ? '-r' : '-R')} argument. "${chalk().bold.white(
                    getAppFolder()
                )}" CLEANING...DONE`
            );
            await cleanPlatformBuild(ctx.platform);
        }

        await createPlatformBuild(ctx.platform);
        await resolveEngineDependencies();
        // TODO: check if this is needed or can be handled down the line
        // if not monorepo && mutations were found
        // await installPackageDependencies();
        // await overrideTemplatePlugins();
        // await configureFonts();

        // OLD STUFFF
        // await injectPlatformDependencies(
        //     async () => {
        //         await installPackageDependencies();
        //         await overrideTemplatePlugins();
        //         await configureFonts();
        //     },
        //     async () => {
        //         await installPackageDependencies();
        //         await overrideTemplatePlugins();
        //         await configureFonts();
        //     }
        // );
        // await _runCopyPlatforms(c);
        return true;
    },
    task: RnvTaskName.platformConfigure,
});
