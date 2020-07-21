/* eslint-disable import/no-cycle */
import path from 'path';
import { chalk, logTask, logWarning, logInfo } from '../core/systemManager/logger';
import { copyFolderContentsRecursiveSync, fsExistsSync } from '../core/systemManager/fileutils';
import { cleanPlaformAssets, copyRuntimeAssets, copySharedPlatforms } from '../core/projectManager/projectParser';
import { getTimestampPathsConfig } from '../core/common';
import { isPlatformSupportedSync, isPlatformSupported, cleanPlatformBuild, createPlatformBuild } from '../core/platformManager';
import { generateRuntimeConfig } from '../core/configManager/configParser';
import { injectPlatformDependencies } from '../core/configManager/packageParser';
import { overrideTemplatePlugins } from '../core/pluginManager';


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
    // c.platform = c.program.platform || 'all';
    logTask('taskRnvPlatformConfigure', `parent:${parentTask} origin:${originTask}`);

    if (!parentTask || !fsExistsSync(c.paths.project.builds.dir)) {
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

        await isPlatformSupported(c);
        await cleanPlatformBuild(c, c.platform);
        await _runCopyPlatforms(c, c.platform);

        await copyRuntimeAssets(c);
        await copySharedPlatforms(c);
        await generateRuntimeConfig(c);
        await overrideTemplatePlugins(c);
    }
};

export default {
    description: '',
    fn: taskRnvPlatformConfigure,
    task: 'platform configure',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
