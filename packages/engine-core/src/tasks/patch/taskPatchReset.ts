import {
    RnvFileName,
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

/**
 * CLI command `npx rnv patch reset` triggers this task to reset applied plugin overrides in a project.
 * This task checks if the plugin overrides have been applied in the project
 * and reverts them to their original state if they have been. It handles both
 * monorepo and non-monorepo project structures by determining the appropriate
 * override directory and root path.
 *
 * The process involves:
 * 1. Checking for the existence of the override directory.
 * 2. Reading the applied overrides from a JSON file if it exists.
 * 3. Iterating over each package and its overridden files to revert them
 *    using backup files, if available.
 * 4. Logging warnings if backup files are missing and cannot revert.
 * 5. Removing the override directory after successful reversion.
 * 6. Logging a summary message upon completion.
 *
 * @returns {Promise<boolean>} Returns a promise that resolves to `true` if the
 *                             task completes successfully.
 */
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
        const appliedOverrideFilePath = path.join(overrideDir, RnvFileName.appliedOverride);
        const appliedOverrides = fsExistsSync(appliedOverrideFilePath)
            ? JSON.parse(fsReadFileSync(appliedOverrideFilePath).toString())
            : {};
        Object.keys(appliedOverrides).forEach((packageName) => {
            const packageOverrides = appliedOverrides[packageName];
            Object.keys(packageOverrides).forEach((fileKey) => {
                if (fileKey !== 'version') {
                    const dest = path.join(rootPath, 'node_modules', packageName, fileKey);
                    const backupPath = path.join(overrideDir, packageName, fileKey);
                    if (fsExistsSync(backupPath)) {
                        revertOverrideToOriginal(dest, backupPath);
                    } else {
                        logWarning(`Backup file not found for ${dest}. Cannot revert.`);
                    }
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
