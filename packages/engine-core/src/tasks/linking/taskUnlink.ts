import path from 'path';
import {
    logInfo,
    logTask,
    RnvTaskOptionPresets,
    fsExistsSync,
    fsRenameSync,
    fsUnlinkSync,
    fsLstatSync,
    RnvTaskFn,
    RnvContext,
    RnvTask,
    RnvTaskName,
    fsReaddirSync,
} from '@rnv/core';
import { RNV_PACKAGES } from './constants';
import { mkdirSync } from 'fs';

const _unlinkPackage = (c: RnvContext, nmDir: string, key: string) => {
    const rnvDepPath = path.join(nmDir, key);
    const nmRnvDir = path.join(nmDir, '.rnv/unlinked_cache');
    if (!fsExistsSync(nmRnvDir)) {
        mkdirSync(nmRnvDir);
    }
    const rnvDepPathUnlinked = path.join(nmRnvDir, key);

    if (!fsExistsSync(rnvDepPathUnlinked)) {
        logInfo(`${key} is not linked. SKIPPING`);
    } else if (fsExistsSync(rnvDepPath)) {
        if (fsLstatSync(rnvDepPath).isSymbolicLink()) {
            fsUnlinkSync(rnvDepPath);
            fsRenameSync(rnvDepPathUnlinked, rnvDepPath);
            logInfo(`${key} => unlink => SUCCESS`);
        } else {
            logInfo(`${key} is not a symlink anymore. SKIPPING`);
        }
    }
};

const _findAndUnlinkPackage = (c: RnvContext, key: string) => {
    _unlinkPackage(c, c.paths.project.nodeModulesDir, key);
    const monoPackages = path.join(c.paths.project.dir, 'packages');
    //If monorepo, we need to link all packages
    if (fsExistsSync(monoPackages)) {
        fsReaddirSync(monoPackages).forEach((pkg) => {
            const pkgPath = path.join(monoPackages, pkg);
            if (fsExistsSync(pkg)) {
                const nmDir = path.join(pkgPath, 'node_modules');
                _unlinkPackage(c, nmDir, key);
            }
        });
    }
};

const taskUnlink: RnvTaskFn = async (c) => {
    logTask('taskUnlink');

    RNV_PACKAGES.forEach((pkg) => {
        if (!pkg.skipLinking) {
            _findAndUnlinkPackage(c, pkg.packageName);
        }
    });

    return true;
};

const Task: RnvTask = {
    description: 'Replaces rnv version in project with original node_modules version',
    fn: taskUnlink,
    task: RnvTaskName.unlink,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
    ignoreEngines: true,
};

export default Task;
