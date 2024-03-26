import { areNodeModulesInstalled, logTask, logInfo, RnvTaskFn, RnvTask, RnvTaskName } from '@rnv/core';
import { installPackageDependenciesAndPlugins } from '../../plugins';

const fn: RnvTaskFn = async (c, parentTask, _) => {
    logTask('taskInstall', `requiresInstall:${!!c._requiresNpmInstall}:${!c.runtime.skipPackageUpdate}`);

    if (c.program.opts().only && !!parentTask) return true;

    if (c.program.opts().skipDependencyCheck) return true;

    // Check node_modules
    // c.runtime.skipPackageUpdate only reflects rnv version mismatch. should not prevent updating other deps
    if (!areNodeModulesInstalled() || c._requiresNpmInstall /* && !c.runtime.skipPackageUpdate */) {
        if (!areNodeModulesInstalled()) {
            logInfo('node_modules folder is missing. INSTALLING...');
        } else {
            logInfo('node_modules folder is out of date. INSTALLING...');
        }
        c._requiresNpmInstall = false;
        await installPackageDependenciesAndPlugins();
    }
    return true;
};

const Task: RnvTask = {
    description: 'Install package node_modules via yarn or npm',
    fn: async () => {},
    task: RnvTaskName.install,
};

export default Task;
