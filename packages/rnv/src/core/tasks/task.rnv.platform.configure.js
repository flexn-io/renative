/* eslint-disable import/no-cycle */
// @todo fix cycle dep
import path from 'path';
import { chalk, logTask, logWarning } from '../systemManager/logger';
import {
    copyFolderContentsRecursiveSync
} from '../systemManager/fileutils';
import { cleanPlaformAssets } from '../projectManager/projectParser';
import { getTimestampPathsConfig } from '../common';
import { isPlatformSupportedSync, isPlatformSupported, cleanPlatformBuild } from '../platformManager';


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

export const rnvPlatformConfigure = async (c) => {
    // c.platform = c.program.platform || 'all';
    logTask(`rnvPlatformConfigure:${c.platform}`);

    await isPlatformSupported(c);
    await cleanPlatformBuild(c, c.platform);
    await cleanPlaformAssets(c, c.platform);
    await _runCopyPlatforms(c, c.platform);
};
