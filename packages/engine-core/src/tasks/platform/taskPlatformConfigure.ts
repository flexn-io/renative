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
    PARAMS,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../../common';
import { isBuildSchemeSupported } from '../../buildSchemes';

const taskPlatformConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPlatformConfigure', '');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.platformConfigure, originTask);

    if (shouldSkipTask(c, TaskKey.platformConfigure, originTask)) return true;

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkAndConfigureSdks(c);
    await checkSdk(c);
    await configureRuntimeDefaults(c);

    if (c.program.only && !!parentTask) return true;

    await executeTask(c, TaskKey.install, TaskKey.platformConfigure, originTask);

    const hasBuild = fsExistsSync(c.paths.project.builds.dir);
    logTask('', `taskPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

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

const Task: RnvTask = {
    description: 'Low-level task used by engines to prepare platformBuilds folder',
    fn: taskPlatformConfigure,
    task: TaskKey.platformConfigure,
    options: PARAMS.withBase(),
    platforms: [],
};

export default Task;
