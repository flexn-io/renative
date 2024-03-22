import path from 'path';
import fs from 'fs';
import {
    RnvTaskOptionPresets,
    logTask,
    logInfo,
    logToSummary,
    upgradeProjectDependencies,
    upgradeDependencies,
    executeTask,
    listAndSelectNpmVersion,
    fsExistsSync,
    readObjectSync,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
    NpmPackageFile,
    ConfigFileProject,
    RnvFileName,
} from '@rnv/core';
import { installPackageDependenciesAndPlugins } from '../../plugins';

const taskProjectUpgrade: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskProjectUpgrade');
    const upgradedPaths = [];
    if (fsExistsSync(c.paths.project.config)) {
        await executeTask(RnvTaskName.projectConfigure, RnvTaskName.projectUpgrade, originTask);
        const selectedVersion = await listAndSelectNpmVersion('rnv');

        upgradedPaths.push(...upgradeProjectDependencies(selectedVersion));

        await installPackageDependenciesAndPlugins();
    } else {
        logInfo('Your are running rnv upgrade outside of renative project');
        const packagesPath = path.join(c.paths.project.dir, 'packages');
        if (fsExistsSync(c.paths.project.package) && fsExistsSync(packagesPath)) {
            const selectedVersion = await listAndSelectNpmVersion('rnv');

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
                    const pkgPath = path.join(dirPath, RnvFileName.package);
                    const rnvPath = path.join(dirPath, RnvFileName.renative);
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
    task: RnvTaskName.projectUpgrade,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true,
};

export default Task;
