import path from 'path';
import fs from 'fs';
import {
    logInfo,
    logToSummary,
    upgradeProjectDependencies,
    upgradeDependencies,
    executeTask,
    listAndSelectNpmVersion,
    fsExistsSync,
    readObjectSync,
    createTask,
    RnvTaskName,
    NpmPackageFile,
    ConfigFileProject,
    RnvFileName,
} from '@rnv/core';
import { installPackageDependenciesAndPlugins } from '../../taskHelpers';

export default createTask({
    description: 'Upgrade or downgrade RNV dependencies in your ReNative project',
    fn: async ({ ctx, taskName, originTaskName }) => {
        const { paths, files } = ctx;
        const upgradedPaths = [];
        if (fsExistsSync(paths.project.config)) {
            await executeTask({ taskName: RnvTaskName.projectConfigure, parentTaskName: taskName, originTaskName });
            const selectedVersion = await listAndSelectNpmVersion('rnv');

            upgradedPaths.push(...upgradeProjectDependencies(selectedVersion));

            await installPackageDependenciesAndPlugins();
        } else {
            logInfo('Your are running rnv upgrade outside of renative project');
            const packagesPath = path.join(paths.project.dir, 'packages');
            if (fsExistsSync(paths.project.package) && fsExistsSync(packagesPath)) {
                const selectedVersion = await listAndSelectNpmVersion('rnv');

                upgradedPaths.push(
                    ...upgradeDependencies(
                        files.project.package,
                        paths.project.package,
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
                            upgradedPaths.push(
                                ...upgradeDependencies(pkgFile, pkgPath, rnvFile, rnvPath, selectedVersion)
                            );
                        }
                    }
                });
            }
        }

        logToSummary(`Upgraded following files:\n${upgradedPaths.join('\n')}`);

        return true;
    },
    task: RnvTaskName.projectUpgrade,
    isGlobalScope: true,
});
