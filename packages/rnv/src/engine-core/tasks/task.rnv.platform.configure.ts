import { chalk, logTask, logInfo } from '../../core/systemManager/logger';
import { fsExistsSync } from '../../core/systemManager/fileutils';
import { getAppFolder } from '../../core/common';
import { isBuildSchemeSupported } from '../../core/configManager/schemeParser';
import { isPlatformSupported, cleanPlatformBuild, createPlatformBuild } from '../../core/platformManager';
import { injectPlatformDependencies } from '../../core/configManager/packageParser';
import { configureRuntimeDefaults } from '../../core/runtimeManager';
import { executeTask, shouldSkipTask } from '../../core/taskManager';
import { PARAMS, TASK_PLATFORM_CONFIGURE, TASK_PROJECT_CONFIGURE, TASK_INSTALL } from '../../core/constants';

import { checkSdk } from '../../core/sdkManager/installer';
import { RnvTaskFn } from '../../core/taskManager/types';

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
