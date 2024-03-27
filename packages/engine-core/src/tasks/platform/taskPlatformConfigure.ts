import {
    chalk,
    logTask,
    logInfo,
    fsExistsSync,
    getAppFolder,
    isPlatformSupported,
    cleanPlatformBuild,
    createPlatformBuild,
    injectPlatformDependencies,
    configureRuntimeDefaults,
    executeTask,
    RnvTask,
    RnvTaskName,
    installPackageDependencies,
    overrideTemplatePlugins,
} from '@rnv/core';
import { isBuildSchemeSupported } from '../../buildSchemes';
import { configureFonts } from '@rnv/sdk-utils';

const Task: RnvTask = {
    description: 'Low-level task used by engines to prepare platformBuilds folder',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx, taskName, originTaskName }) => {
        const { program } = ctx;
        await isPlatformSupported();
        await isBuildSchemeSupported();

        await executeTask({
            taskName: RnvTaskName.sdkConfigure,
            parentTaskName: taskName,
            originTaskName,
            isOptional: true,
        });

        await configureRuntimeDefaults();

        await executeTask({ taskName: RnvTaskName.install, parentTaskName: taskName, originTaskName });

        const hasBuild = fsExistsSync(ctx.paths.project.builds.dir);
        logTask('', `taskPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

        if ((program.opts().reset || program.opts().resetHard) && !ctx.runtime.disableReset) {
            logInfo(
                `You passed ${chalk().bold(program.opts().reset ? '-r' : '-R')} argument. "${chalk().bold(
                    getAppFolder()
                )}" CLEANING...DONE`
            );
            await cleanPlatformBuild(ctx.platform);
        }

        await createPlatformBuild(ctx.platform);
        await injectPlatformDependencies(
            async () => {
                await installPackageDependencies();
                await overrideTemplatePlugins();
                await configureFonts();
            },
            async () => {
                await installPackageDependencies();
                await overrideTemplatePlugins();
                await configureFonts();
            }
        );
        // await _runCopyPlatforms(c);
        return true;
    },
    task: RnvTaskName.platformConfigure,
};

export default Task;
