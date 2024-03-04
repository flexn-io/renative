import path from 'path';
import fs from 'fs';
import {
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
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { NpmPackageFile } from '@rnv/core/lib/configs/types';
import { ConfigFileProject } from '@rnv/core/lib/schema/configFiles/types';

const taskProjectUpgrade: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskProjectUpgrade');
    const upgradedPaths = [];
    if (fsExistsSync(c.paths.project.config)) {
        await executeTask(c, TaskKey.projectConfigure, TaskKey.projectUpgrade, originTask);
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
                        pkgFile = readObjectSync<NpmPackageFile>(pkgPath);
                    }

                    if (fsExistsSync(rnvPath)) {
                        rnvFile = readObjectSync<ConfigFileProject>(rnvPath);
                    }
                    if (pkgFile && rnvFile) {
                        upgradedPaths.push(...upgradeDependencies(pkgFile, pkgPath, rnvFile, rnvPath, selectedVersion));
                    }
                }
            });
        }
    }

    logToSummary(`Upgraded following files:\n${upgradedPaths.join('\n')}`);

    return true;
};

const Task: RnvTask = {
    description: 'Upgrade or downgrade RNV dependencies in your ReNative project',
    fn: taskProjectUpgrade,
    task: TaskKey.projectUpgrade,
    options: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
