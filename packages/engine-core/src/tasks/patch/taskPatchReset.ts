import {
    RnvTaskName,
    createTask,
    fsExistsSync,
    fsReadFileSync,
    getConfigRootProp,
    logToSummary,
    logWarning,
    removeDirSync,
    revertOverrideToOriginal,
} from '@rnv/core';
import path from 'path';

export default createTask({
    description: 'Reset applied overrides',
    fn: async ({ ctx }) => {
        const isMonorepo = getConfigRootProp('isMonorepo');
        const overrideDir = isMonorepo
            ? path.join(ctx.paths.project.dir, '../../.rnv', 'overrides')
            : path.join(ctx.paths.project.dir, '.rnv', 'overrides');

        if (!fsExistsSync(overrideDir)) {
            return logWarning(`Plugin overrides have not been applied yet`);
        }
        const rootPath = isMonorepo ? path.join(ctx.paths.project.dir, '../..') : path.join(ctx.paths.project.dir);
        const appliedOverrideFilePath = path.join(overrideDir, 'applied_overrides.json');
        const appliedOverrides = fsExistsSync(appliedOverrideFilePath)
            ? JSON.parse(fsReadFileSync(appliedOverrideFilePath).toString())
            : {};
        Object.keys(appliedOverrides).forEach((packageName) => {
            const packageOverrides = appliedOverrides[packageName];
            Object.keys(packageOverrides).forEach((fileKey) => {
                const dest = path.join(rootPath, 'node_modules', packageName, fileKey);
                const backupPath = path.join(overrideDir, packageName, fileKey);
                if (fsExistsSync(backupPath)) {
                    revertOverrideToOriginal(dest, backupPath);
                } else {
                    logWarning(`Backup file not found for ${dest}. Cannot revert.`);
                }
            });
        });
        removeDirSync(overrideDir);
        logToSummary(`Plugin overrides have been reverted successfully`);
        return true;
    },
    task: RnvTaskName.patchReset,
    isGlobalScope: true,
});
