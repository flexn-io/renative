import path from 'path';
import fs from 'fs';
import { TASK_PROJECT_UPGRADE, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { logTask, logInfo, logToSummary } from '../../core/systemManager/logger';
import { upgradeProjectDependencies, upgradeDependencies } from '../../core/projectManager';
import { executeTask } from '../../core/taskManager';
import { listAndSelectNpmVersion } from '../../core/systemManager/npmUtils';
import { installPackageDependenciesAndPlugins } from '../../core/pluginManager';
import { fsExistsSync, readObjectSync } from '../../core/systemManager/fileutils';

export const taskRnvProjectUpgrade = async (c: RnvConfig, parentTask, originTask) => {
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
                ...upgradeDependencies(c.files.project.package, c.paths.project.package, null, null, selectedVersion)
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

    logToSummary(`Upgraded following files:\n${upgradedPaths.join('\n')}`, true);

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
