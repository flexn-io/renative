import {
    areNodeModulesInstalled,
    PARAMS,
    installPackageDependenciesAndPlugins,
    logTask,
    logInfo,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskInstall: RnvTaskFn = async (c, parentTask, _) => {
    logTask('taskInstall', `requiresInstall:${!!c._requiresNpmInstall}:${!c.runtime.skipPackageUpdate}`);

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
    fn: taskInstall,
    task: TaskKey.install,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
