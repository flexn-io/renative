/* eslint-disable import/no-cycle */
import path from 'path';
import { chalk, logTask, logWarning, logInfo } from '../core/systemManager/logger';
import { copyFolderContentsRecursiveSync, fsExistsSync } from '../core/systemManager/fileutils';
import { setRuntimeDefaults, generateRuntimeConfig } from '../core/configManager/configParser';
import { cleanPlaformAssets, copyRuntimeAssets, copySharedPlatforms } from '../core/projectManager/projectParser';
import { getTimestampPathsConfig, isBuildSchemeSupported } from '../core/common';
import { isPlatformSupportedSync, isPlatformSupported, cleanPlatformBuild, createPlatformBuild } from '../core/platformManager';
import { injectPlatformDependencies } from '../core/configManager/packageParser';
import { overrideTemplatePlugins, resolvePluginDependants } from '../core/pluginManager';
import { executeTask } from '../core/engineManager';
import { TASK_PLATFORM_CONFIGURE, TASK_PROJECT_CONFIGURE, TASK_INSTALL } from '../core/constants';


import { checkSdk } from '../core/sdkManager';


const _runCopyPlatforms = (c, platform) => new Promise((resolve) => {
    logTask(`_runCopyPlatforms:${platform}`);
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
    logTask('taskRnvPlatformConfigure', `parent:${parentTask} origin:${originTask}`);

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_CONFIGURE, originTask);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);
    await resolvePluginDependants(c);

    await executeTask(c, TASK_INSTALL, TASK_PLATFORM_CONFIGURE, originTask);

    await setRuntimeDefaults(c);

    const hasBuild = fsExistsSync(c.paths.project.builds.dir);
    logTask('', `taskRnvPlatformConfigure hasBuildFolderPresent:${hasBuild}`);

    // if (!parentTask || !hasBuild) {
    if (c.program.reset) {
        logInfo(
            `You passed ${chalk().white('-r')} argument. paltform ${chalk().white(
                c.platform
            )} will be cleaned up first!`
        );
        await cleanPlatformBuild(c, c.platform);
    }

    if (c.program.resetHard) {
        await cleanPlaformAssets(c);
    }
    await createPlatformBuild(c, c.platform);

    await injectPlatformDependencies(c);

    await cleanPlatformBuild(c, c.platform);
    await _runCopyPlatforms(c, c.platform);

    await copyRuntimeAssets(c);
    await copySharedPlatforms(c);
    await generateRuntimeConfig(c);
    await overrideTemplatePlugins(c);
    // }
};

export default {
    description: '',
    fn: taskRnvPlatformConfigure,
    task: 'platform configure',
    params: [],
    platforms: [],
};
