import path from 'path';
import { chalk, logTask, logWarning, logInfo } from '../core/systemManager/logger';
import { copyFolderContentsRecursiveSync, fsExistsSync } from '../core/systemManager/fileutils';
import { getTimestampPathsConfig, getAppFolder } from '../core/common';
import { isBuildSchemeSupported } from '../core/configManager/schemeParser';
import { isPlatformSupportedSync, isPlatformSupported, cleanPlatformBuild, createPlatformBuild } from '../core/platformManager';
import { injectPlatformDependencies } from '../core/configManager/packageParser';
import { resolvePluginDependants } from '../core/pluginManager';
import { executeTask } from '../core/engineManager';
import { TASK_PLATFORM_CONFIGURE, TASK_PROJECT_CONFIGURE, TASK_INSTALL } from '../core/constants';


import { checkSdk } from '../core/sdkManager';


const _runCopyPlatforms = c => new Promise((resolve) => {
    logTask('_runCopyPlatforms');
    const { platform } = c;
    const copyPlatformTasks = [];

    if (platform === 'all') {
        Object.keys(c.buildConfig.platforms).forEach((k) => {
            if (isPlatformSupportedSync(k)) {
                const ptPath = path.join(
                    c.paths.project.platformTemplatesDirs[k],
                    `${k}`
                );
                const pPath = path.join(
                    c.paths.project.builds.dir,
                    `${c.runtime.appId}_${k}`
                );
                copyPlatformTasks.push(
                    copyFolderContentsRecursiveSync(ptPath, pPath, true, false, false, {},
                        getTimestampPathsConfig(c, platform), c)
                );
            }
        });
    } else if (isPlatformSupportedSync(platform)) {
        const ptPath = path.join(
            c.paths.project.platformTemplatesDirs[platform],
            `${platform}`
        );
        const pPath = path.join(
            c.paths.project.builds.dir,
            `${c.runtime.appId}_${platform}`
        );
        copyPlatformTasks.push(
            copyFolderContentsRecursiveSync(ptPath, pPath, true, false, false, {},
                getTimestampPathsConfig(c, platform), c)
        );
    } else {
        logWarning(
            `Your platform ${chalk().white(
                platform
            )} config is not present. Check ${chalk().white(
                c.paths.appConfig.config
            )}`
        );
    }

    Promise.all(copyPlatformTasks).then(() => {
        resolve();
    });
});

export const taskRnvPlatformConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformConfigure', '');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_CONFIGURE, originTask);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);

    if (c.program.only && !!parentTask) return true;

    await resolvePluginDependants(c);

    await executeTask(c, TASK_INSTALL, TASK_PLATFORM_CONFIGURE, originTask);

    const hasBuild = fsExistsSync(c.paths.project.builds.dir);
    logTask('', `taskRnvPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

    if (c.program.reset || c.program.resetHard) {
        logInfo(
            `You passed ${chalk().white(c.program.reset ? '-r' : '-R')} argument. "${chalk().white(getAppFolder(c, c.platform))}" CLEANING...DONE`
        );
        await cleanPlatformBuild(c, c.platform);
    }

    await createPlatformBuild(c, c.platform);
    await injectPlatformDependencies(c);
    await cleanPlatformBuild(c, c.platform);
    await _runCopyPlatforms(c);
};

export default {
    description: '',
    fn: taskRnvPlatformConfigure,
    task: 'platform configure',
    params: [],
    platforms: [],
};
