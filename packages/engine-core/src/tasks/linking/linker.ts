import {
    NpmPackageFile,
    RnvFileName,
    chalk,
    fsExistsSync,
    fsLstatSync,
    fsReaddirSync,
    getContext,
    logInfo,
    readObjectSync,
} from '@rnv/core';
import path from 'path';
import { LinkablePackage, SourcePackage } from './types';

const captureLinkablePackages = (
    baseDir: string,
    sourcePackages: SourcePackage[],
    linkablePackages: LinkablePackage[]
) => {
    sourcePackages.forEach((pkg) => {
        const rnvDepPath = path.join(baseDir, pkg.name);

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
        const unlinkedPath = path.join(cacheDir, pkg.name);
        const unlinkedPathExists = fsExistsSync(unlinkedPath);

        if (nmPathExists || isSymLink || unlinkedPathExists) {
            linkablePackages.push({
                name: pkg.name,
                nmPath: rnvDepPath,
                sourcePath: pkg.path,
                sourcePathRelative: path.relative(rnvDepPath.replace(`/${pkg.name}`, ''), pkg.path),
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

export const traverseTargetProject = (sourceDir: string) => {
    const c = getContext();
    const linkablePackages: LinkablePackage[] = [];
    const sourcePackages = traverseSourceProject(sourceDir);
    captureLinkablePackages(c.paths.project.nodeModulesDir, sourcePackages, linkablePackages);
    const monoPackages = path.join(c.paths.project.dir, 'packages');
    // If monorepo, we need to link all packages
    if (fsExistsSync(monoPackages)) {
        fsReaddirSync(monoPackages).forEach((pkgName) => {
            const pkgPath = path.join(monoPackages, pkgName);
            captureLinkablePackages(path.join(pkgPath, 'node_modules'), sourcePackages, linkablePackages);
        });
    }
    return linkablePackages;
};

export const getSourceDir = () => {
    const ctx = getContext<any, 'dir'>();
    const dirOption = ctx.program.dir;

    if (dirOption) {
        logInfo(`Using custom source directory: ${chalk().bold(dirOption)}`);
    }

    // As default we'll use the development source directory which is a monorepo
    const sourceDir = ctx.program.dir || path.join(ctx.paths.rnvCore.dir, '../../');
    if (!fsExistsSync(sourceDir)) {
        throw new Error(`Source directory ${sourceDir} does not exist!`);
    }
    return sourceDir;
};

const captureSourcePackage = (baseDir: string, sourcePackages: SourcePackage[]) => {
    const pkgPath = path.join(baseDir, RnvFileName.package);
    if (fsExistsSync(pkgPath)) {
        const pkgFile = readObjectSync<NpmPackageFile>(pkgPath);
        if (pkgFile?.name) {
            sourcePackages.push({
                name: pkgFile.name,
                path: baseDir,
                skipLinking: false,
            });
        }
    }
};

export const traverseSourceProject = (sourceDir: string) => {
    const sourcePackages: SourcePackage[] = [];
    captureSourcePackage(sourceDir, sourcePackages);
    const monoPackages = path.join(sourceDir, 'packages');
    // If monorepo, we need to link all packages
    if (fsExistsSync(monoPackages)) {
        fsReaddirSync(monoPackages).forEach((pkgName) => {
            if (pkgName.startsWith('@')) {
                const monoPackageGroup = path.join(monoPackages, pkgName);
                fsReaddirSync(monoPackages).forEach((pkgName) => {
                    const pkgPath = path.join(monoPackageGroup, pkgName);
                    captureSourcePackage(pkgPath, sourcePackages);
                });
            } else {
                const pkgPath = path.join(monoPackages, pkgName);
                captureSourcePackage(pkgPath, sourcePackages);
            }
        });
    }
    return sourcePackages;
};
