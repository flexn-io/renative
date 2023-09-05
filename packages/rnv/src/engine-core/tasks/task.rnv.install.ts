import { areNodeModulesInstalled } from '../../core/systemManager/npmUtils';
import { PARAMS } from '../../core/constants';
import { installPackageDependenciesAndPlugins } from '../../core/pluginManager';
import { logTask, logInfo } from '../../core/systemManager/logger';
import { RnvTaskFn } from '../../core/taskManager/types';

export const taskRnvInstall: RnvTaskFn = async (c, parentTask, _) => {
    logTask('taskRnvInstall', `requiresInstall:${!!c._requiresNpmInstall}:${!c.runtime.skipPackageUpdate}`);

    if (c.program.only && !!parentTask) return true;

    if (c.program.skipDependencyCheck) return true;

    // Check node_modules
    // c.runtime.skipPackageUpdate only reflects rnv version mismatch. should not prevent updating other deps
    if (!areNodeModulesInstalled() || c._requiresNpmInstall /* && !c.runtime.skipPackageUpdate */) {
        if (!areNodeModulesInstalled()) {
            logInfo('node_modules folder is missing. INSTALLING...');
        } else {
            logInfo('node_modules folder is out of date. INSTALLING...');
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
