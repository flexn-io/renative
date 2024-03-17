import path from 'path';
import {
    logInfo,
    logTask,
    RnvTaskOptionPresets,
    fsExistsSync,
    fsRenameSync,
    fsSymlinkSync,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
    mkdirSync,
    fsReaddirSync,
    getContext,
    chalk,
    fsLstatSync,
    fsUnlinkSync,
    removeDirSync,
} from '@rnv/core';
import { RNV_PACKAGES } from './constants';
import { LinkablePackage } from './types';

const _linkPackage = (pkg: LinkablePackage) => {
    if (!fsExistsSync(pkg.cacheDir)) {
        mkdirSync(pkg.cacheDir);
    }

    if (pkg.isBrokenLink) {
        logInfo(`${pkg.name} is a ${chalk().red('broken')} link. Attempting to fix...`);
        fsUnlinkSync(pkg.nmPath);
    } else if (pkg.isLinked) {
        logInfo(`${pkg.name} is already linked. SKIPPING`);
    } else if (pkg.nmPathExists) {
        if (pkg.unlinkedPathExists) {
            logInfo(`${pkg.name} found in exisitng cache. Removing and relinking...`);
            removeDirSync(pkg.unlinkedPath);
        }
        mkdirSync(pkg.unlinkedPath);
        fsRenameSync(pkg.nmPath, pkg.unlinkedPath);
        fsSymlinkSync(pkg.sourcePath, pkg.nmPath);
        logInfo(`${pkg.name} => link => ${chalk().green('SUCCESS')} (${chalk().gray(pkg.nmPath)})`);
    } else if (pkg.unlinkedPathExists) {
        logInfo(`${pkg.name} found in unlinked cache. Attempting to relink...`);
        fsSymlinkSync(pkg.sourcePath, pkg.nmPath);
        logInfo(`${pkg.name} => link => ${chalk().green('SUCCESS')} (${chalk().gray(pkg.nmPath)})`);
    }
};

const captureLinkablePackages = (baseDir: string, linkablePackages: LinkablePackage[]) => {
    const ctx = getContext();
    RNV_PACKAGES.forEach((pkg) => {
        const rnvDepPath = path.join(baseDir, pkg.packageName);

        // const stat = fsStatSync(rnvDepPath);
        // console.log('DJDJDJDDJ', rnvDepPath, fsExistsSync(rnvDepPath));
        let isSymLink = false;
        const nmPathExists = fsExistsSync(rnvDepPath);
        try {
            isSymLink = fsLstatSync(rnvDepPath).isSymbolicLink();
            if (!nmPathExists) {
                // Broken link
            }
        } catch (e) {
            //Catch error
        }
        const cacheDir = path.join(baseDir, '.rnv/unlinked_cache');
        const unlinkedPath = path.join(cacheDir, pkg.packageName);
        const unlinkedPathExists = fsExistsSync(unlinkedPath);

        if (nmPathExists || isSymLink || unlinkedPathExists) {
            const sourcePath = path.join(ctx.paths.rnv.dir, '../', pkg.folderName);
            linkablePackages.push({
                name: pkg.packageName,
                nmPath: rnvDepPath,
                sourcePath,
                sourcePathRelative: path.relative(rnvDepPath.replace(`/${pkg.packageName}`, ''), sourcePath),
                unlinkedPath,
                cacheDir,
                skipLinking: pkg.skipLinking || false,
                isLinked: isSymLink,
                isBrokenLink: isSymLink && !nmPathExists,
                nmPathExists,
                unlinkedPathExists,
            });
        }
    });
};

const traverseProject = () => {
    const c = getContext();
    const linkablePackages: LinkablePackage[] = [];
    captureLinkablePackages(c.paths.project.nodeModulesDir, linkablePackages);
    const monoPackages = path.join(c.paths.project.dir, 'packages');
    // If monorepo, we need to link all packages
    if (fsExistsSync(monoPackages)) {
        fsReaddirSync(monoPackages).forEach((pkgName) => {
            const pkgPath = path.join(monoPackages, pkgName);
            captureLinkablePackages(path.join(pkgPath, 'node_modules'), linkablePackages);
        });
    }
    return linkablePackages;
};

const taskLink: RnvTaskFn = async (_c, _parentTask, _originalTask) => {
    logTask('taskLink');
    const linkablePackages = traverseProject();

    let msg = 'Found following renative packages:\n\n';

    linkablePackages.forEach((pkg) => {
        msg += `${pkg.nmPath.replace(pkg.name, chalk().bold(pkg.name))} ${
            pkg.isBrokenLink ? chalk().red('(broken)') : pkg.isLinked ? chalk().green('(linked)') : '(unlinked)'
        }\n`;
    });

    logInfo(msg);

    linkablePackages.forEach((pkg) => {
        _linkPackage(pkg);
    });

    return true;
};

const Task: RnvTask = {
    description: 'Links development version or renative with this project',
    fn: taskLink,
    task: RnvTaskName.link,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
    ignoreEngines: true,
};

export default Task;
