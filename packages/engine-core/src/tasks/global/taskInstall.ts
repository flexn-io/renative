import { areNodeModulesInstalled, logInfo, createTask, RnvTaskName } from '@rnv/core';
import { installPackageDependenciesAndPlugins } from '../../plugins';

export default createTask({
    description: 'Install package node_modules via yarn or npm',
    fn: async ({ ctx }) => {
        if (ctx.program.opts().skipDependencyCheck) return true;

        // Check node_modules
        // c.runtime.skipPackageUpdate only reflects rnv version mismatch. should not prevent updating other deps
        if (!areNodeModulesInstalled() || ctx._requiresNpmInstall /* && !c.runtime.skipPackageUpdate */) {
            if (!areNodeModulesInstalled()) {
                logInfo('node_modules folder is missing. INSTALLING...');
            } else {
                logInfo('node_modules folder is out of date. INSTALLING...');
            }
            ctx._requiresNpmInstall = false;
            // await handleMutations();
            await installPackageDependenciesAndPlugins();
        }
        return true;
    },
    task: RnvTaskName.install,
});
