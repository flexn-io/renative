import { areNodeModulesInstalled } from '../core/common';

import { installPackageDependencies } from '../core/systemManager/exec';
import { chalk, logTask, logWarning } from '../core/systemManager/logger';

export const taskRnvInstall = async (c, parentTask) => {
    logTask('taskRnvInstall', `requiresInstall:${!!c._requiresNpmInstall}:${!c.runtime.skipPackageUpdate}`);

    if (c.program.only && !!parentTask) return true;

    // Check node_modules
    if (!areNodeModulesInstalled() || (c._requiresNpmInstall && !c.runtime.skipPackageUpdate)) {
        if (!areNodeModulesInstalled()) {
            logWarning(
                `Looks like your node_modules folder is missing! Let's run ${chalk().white(
                    'npm install'
                )} first!`
            );
        } else {
            logWarning(
                `Looks like your node_modules out of date! Let's run ${chalk().white(
                    'npm install'
                )} first!`
            );
        }
        c._requiresNpmInstall = false;
        await installPackageDependencies();
    }
    return true;
};

export default {
    description: 'Install package node_modules via yarn or npm',
    fn: taskRnvInstall,
    task: 'install',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
