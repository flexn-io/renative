import path from 'path';
import {
    logInfo,
    logTask,
    logSuccess,
    PARAMS,
    fsExistsSync,
    fsRenameSync,
    fsUnlinkSync,
    fsLstatSync,
    RnvTaskFn,
    RnvContext,
    RnvTask,
} from '@rnv/core';
import { RNV_PACKAGES, TASK_UNLINK } from './common';

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

const Task: RnvTask = {
    description: 'Replaces rnv version in project with original node_modules version',
    fn: taskRnvUnlink,
    task: TASK_UNLINK,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    ignoreEngines: true,
};

export default Task;
