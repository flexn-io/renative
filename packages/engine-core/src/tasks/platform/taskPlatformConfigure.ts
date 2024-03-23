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
    shouldSkipTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
    installPackageDependencies,
    overrideTemplatePlugins,
} from '@rnv/core';
import { isBuildSchemeSupported } from '../../buildSchemes';
import { configureFonts } from '@rnv/sdk-utils';

const taskPlatformConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPlatformConfigure', '');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.platformConfigure, originTask);

    if (shouldSkipTask(RnvTaskName.platformConfigure, originTask)) return true;

    await isPlatformSupported();
    await isBuildSchemeSupported();

    await executeTask(RnvTaskName.sdkConfigure, RnvTaskName.platformConfigure, originTask, true);

    await configureRuntimeDefaults();

    if (c.program.only && !!parentTask) return true;

    await executeTask(RnvTaskName.install, RnvTaskName.platformConfigure, originTask);

    const hasBuild = fsExistsSync(c.paths.project.builds.dir);
    logTask('', `taskPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

    if ((c.program.reset || c.program.resetHard) && !c.runtime.disableReset) {
        logInfo(
            `You passed ${chalk().bold(c.program.reset ? '-r' : '-R')} argument. "${chalk().bold(
                getAppFolder()
            )}" CLEANING...DONE`
        );
        await cleanPlatformBuild(c.platform);
    }

    await createPlatformBuild(c.platform);
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
};

const Task: RnvTask = {
    description: 'Low-level task used by engines to prepare platformBuilds folder',
    fn: taskPlatformConfigure,
    task: RnvTaskName.platformConfigure,
    options: RnvTaskOptionPresets.withBase(),
};

export default Task;
