import path from 'path';
import {
    logInfo,
    logTask,
    logSuccess,
    PARAMS,
    fsExistsSync,
    fsRenameSync,
    fsSymlinkSync,
    RnvTaskFn,
    RnvContext,
    RnvTask,
    TASK_LINK,
} from '@rnv/core';
import { RNV_PACKAGES } from '../constants';

const _linkPackage = (c: RnvContext, key: string, folder: string) => {
    const rnvPath = path.join(c.paths.project.nodeModulesDir, key);
    const rnvPathUnlinked = path.join(c.paths.project.nodeModulesDir, `${key}_unlinked`);
    const pkgDir = path.join(c.paths.rnv.dir, '../', folder);

    if (fsExistsSync(rnvPathUnlinked)) {
        logInfo(`${key} is already linked. SKIPPING`);
    } else if (fsExistsSync(rnvPath)) {
        fsRenameSync(rnvPath, rnvPathUnlinked);
        fsSymlinkSync(pkgDir, rnvPath);
        logSuccess(`${key} => link => SUCCESS`);
    }
};

export const taskRnvLink: RnvTaskFn = async (c, _parentTask, _originalTask) => {
    logTask('taskRnvLink');

    RNV_PACKAGES.forEach((pkg) => {
        if (!pkg.skipLinking) {
            _linkPackage(c, pkg.packageName, pkg.folderName);
        }
    });

    return true;
};

const Task: RnvTask = {
    description: 'Links development version or renative with this project',
    fn: taskRnvLink,
    task: TASK_LINK,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    ignoreEngines: true,
};

export default Task;
