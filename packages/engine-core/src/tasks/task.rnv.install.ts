import {
    areNodeModulesInstalled,
    PARAMS,
    installPackageDependenciesAndPlugins,
    logTask,
    logInfo,
    RnvTaskFn,
    RnvTask,
} from '@rnv/core';

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

const Task: RnvTask = {
    description: 'Install package node_modules via yarn or npm',
    fn: taskRnvInstall,
    task: 'install',
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
