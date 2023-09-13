import {
    chalk,
    logTask,
    logInfo,
    fsExistsSync,
    getAppFolder,
    isBuildSchemeSupported,
    isPlatformSupported,
    cleanPlatformBuild,
    createPlatformBuild,
    injectPlatformDependencies,
    configureRuntimeDefaults,
    executeTask,
    shouldSkipTask,
    PARAMS,
    TASK_PLATFORM_CONFIGURE,
    TASK_PROJECT_CONFIGURE,
    TASK_INSTALL,
    checkSdk,
    RnvTaskFn,
} from 'rnv';

export const taskRnvPlatformConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformConfigure', '');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_CONFIGURE, originTask);

    if (shouldSkipTask(c, TASK_PLATFORM_CONFIGURE, originTask)) return true;

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkAndConfigureSdks(c);
    await checkSdk(c);
    await configureRuntimeDefaults(c);

    if (c.program.only && !!parentTask) return true;

    await executeTask(c, TASK_INSTALL, TASK_PLATFORM_CONFIGURE, originTask);

    const hasBuild = fsExistsSync(c.paths.project.builds.dir);
    logTask('', `taskRnvPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

    if ((c.program.reset || c.program.resetHard) && !c.runtime.disableReset) {
        logInfo(
            `You passed ${chalk().white(c.program.reset ? '-r' : '-R')} argument. "${chalk().white(
                getAppFolder(c)
            )}" CLEANING...DONE`
        );
        await cleanPlatformBuild(c, c.platform);
    }

    await createPlatformBuild(c, c.platform);
    await injectPlatformDependencies(c);
    // await _runCopyPlatforms(c);
    return true;
};

export default {
    description: '',
    fn: taskRnvPlatformConfigure,
    task: TASK_PLATFORM_CONFIGURE,
    params: PARAMS.withBase(),
    platforms: [],
};
