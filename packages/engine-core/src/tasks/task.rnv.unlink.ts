import path from 'path';
import {
    logInfo,
    logTask,
    logSuccess,
    PARAMS,
    RNV_PACKAGES,
    fsExistsSync,
    fsRenameSync,
    fsUnlinkSync,
    fsLstatSync,
    RnvTaskFn,
    RnvContext,
} from '@rnv/core';

const _unlinkPackage = (c: RnvContext, key: string) => {
    const rnvPath = path.join(c.paths.project.nodeModulesDir, key);
    const rnvPathUnlinked = path.join(c.paths.project.nodeModulesDir, `${key}_unlinked`);

    if (!fsExistsSync(rnvPathUnlinked)) {
        logInfo(`${key} is not linked. SKIPPING`);
    } else if (fsExistsSync(rnvPath)) {
        if (fsLstatSync(rnvPath).isSymbolicLink()) {
            fsUnlinkSync(rnvPath);
            fsRenameSync(rnvPathUnlinked, rnvPath);
            logSuccess(`${key} => unlink => SUCCESS`);
        } else {
            logInfo(`${key} is not a symlink anymore. SKIPPING`);
        }
    }
};

export const taskRnvUnlink: RnvTaskFn = async (c) => {
    logTask('taskRnvUnlink');

    RNV_PACKAGES.forEach((pkg) => {
        if (!pkg.skipLinking) {
            _unlinkPackage(c, pkg.packageName);
        }
    });

    return true;
};

export default {
    description: '',
    fn: taskRnvUnlink,
    task: 'unlink',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
    isGlobalScope: true,
};
