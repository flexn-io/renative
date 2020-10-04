import { areNodeModulesInstalled } from '../../core/common';
import { PARAMS } from '../../core/constants';
import { installPackageDependenciesAndPlugins } from '../../core/pluginManager';
import { logTask, logWarning } from '../../core/systemManager/logger';

export const taskRnvInstall = async (c, parentTask) => {
    logTask('taskRnvInstall', `requiresInstall:${!!c._requiresNpmInstall}:${!c.runtime.skipPackageUpdate}`);

    if (c.program.only && !!parentTask) return true;

    // Check node_modules
    if (!areNodeModulesInstalled() || (c._requiresNpmInstall && !c.runtime.skipPackageUpdate)) {
        if (!areNodeModulesInstalled()) {
            logWarning(
                'Looks like your node_modules folder is missing. INSTALLING...'
            );
        } else {
            logWarning(
                'Looks like your node_modules out of date. INSTALLING...'
            );
        }
        c._requiresNpmInstall = false;
        await installPackageDependenciesAndPlugins(c);
    }
    return true;
};

export default {
    description: 'Install package node_modules via yarn or npm',
    fn: taskRnvInstall,
    task: 'install',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
