import path from 'path';
import fs from 'fs';
import {
    TASK_PROJECT_UPGRADE,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    logTask,
    logInfo,
    logToSummary,
    upgradeProjectDependencies,
    upgradeDependencies,
    executeTask,
    listAndSelectNpmVersion,
    installPackageDependenciesAndPlugins,
    fsExistsSync,
    readObjectSync,
    RnvTaskFn,
} from '@rnv/core';

export const taskRnvProjectUpgrade: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvProjectUpgrade');
    const upgradedPaths = [];
    if (fsExistsSync(c.paths.project.config)) {
        await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PROJECT_UPGRADE, originTask);
        const selectedVersion = await listAndSelectNpmVersion(c, 'rnv');

        upgradedPaths.push(...upgradeProjectDependencies(c, selectedVersion));

        await installPackageDependenciesAndPlugins(c);
    } else {
        logInfo('Your are running rnv upgrade outside of renative project');
        const packagesPath = path.join(c.paths.project.dir, 'packages');
        if (fsExistsSync(c.paths.project.package) && fsExistsSync(packagesPath)) {
            const selectedVersion = await listAndSelectNpmVersion(c, 'rnv');

            upgradedPaths.push(
                ...upgradeDependencies(
                    c.files.project.package,
                    c.paths.project.package,
                    undefined,
                    null,
                    selectedVersion
                )
            );

            const dirs = fs.readdirSync(packagesPath);

            dirs.forEach((dir) => {
                const dirPath = path.join(packagesPath, dir);
                if (fs.statSync(dirPath).isDirectory()) {
                    const pkgPath = path.join(dirPath, 'package.json');
                    const rnvPath = path.join(dirPath, 'renative.json');
                    let pkgFile;
                    let rnvFile;
                    if (fsExistsSync(pkgPath)) {
                        pkgFile = readObjectSync(pkgPath);
                    }

                    if (fsExistsSync(rnvPath)) {
                        rnvFile = readObjectSync(rnvPath);
                    }
                    upgradedPaths.push(...upgradeDependencies(pkgFile, pkgPath, rnvFile, rnvPath, selectedVersion));
                }
            });
        }
    }

    logToSummary(`Upgraded following files:\n${upgradedPaths.join('\n')}`);

    return true;
};

export default {
    description: 'Upgrade or downgrade RNV dependencies in your ReNative project',
    fn: taskRnvProjectUpgrade,
    task: TASK_PROJECT_UPGRADE,
    params: PARAMS.withBase(),
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true,
    isGlobalScope: true,
};
