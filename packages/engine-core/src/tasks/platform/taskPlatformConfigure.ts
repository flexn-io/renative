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
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../../common';
import { isBuildSchemeSupported } from '../../buildSchemes';

const taskPlatformConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPlatformConfigure', '');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.platformConfigure, originTask);

    if (shouldSkipTask(RnvTaskName.platformConfigure, originTask)) return true;

    await isPlatformSupported();
    await isBuildSchemeSupported();
    await checkAndConfigureSdks();
    await checkSdk();
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
    await injectPlatformDependencies();
    // await _runCopyPlatforms(c);
    return true;
};

const Task: RnvTask = {
    description: 'Low-level task used by engines to prepare platformBuilds folder',
    fn: taskPlatformConfigure,
    task: RnvTaskName.platformConfigure,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
