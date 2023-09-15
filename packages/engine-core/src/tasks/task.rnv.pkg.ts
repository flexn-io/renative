import path from 'path';
import semver from 'semver';

import {
    executeAsync,
    Context,
    copyFileSync,
    updateObjectSync,
    fsExistsSync,
    fsReaddirSync,
    fsLstatSync,
    writeFileSync,
    PARAMS,
    TASK_PKG,
    TASK_PROJECT_CONFIGURE,
    logError,
    logTask,
    executeTask,
    RnvTaskFn,
} from 'rnv';

const bumpVersions = (version: string) => {
    const {
        project: { dir },
        rnv: { pluginTemplates },
    } = Context.getContext().paths;
    // check for packages to bump
    const packagesDir = path.join(dir, 'packages');
    if (fsExistsSync(packagesDir)) {
        const packages = fsReaddirSync(packagesDir);
        packages.forEach((name) => {
            const pkgPath = path.join(packagesDir, name);
            const pkgJsonPath = path.join(pkgPath, 'package.json');
            if (fsLstatSync(pkgPath).isDirectory() && fsExistsSync(pkgJsonPath)) {
                // we found a packaaaage, fist-bumpin' it
                const existingPkgJson = require(pkgJsonPath);
                existingPkgJson.version = version;
                writeFileSync(pkgJsonPath, existingPkgJson);
            }
        });
        // check if it's our turf and do some extra magic
        const renativePkgPath = path.join(packagesDir, 'renative');
        if (pluginTemplates.config && fsExistsSync(renativePkgPath)) {
            copyFileSync(path.join(dir, 'README.md'), path.join(renativePkgPath, 'README.md'));
            updateObjectSync(pluginTemplates.config, {
                pluginTemplates: {
                    renative: {
                        version,
                    },
                },
            });
        }
    }
};

const publishAll = () => {
    const {
        project: { dir },
    } = Context.getContext().paths;
    const packagesDir = path.join(dir, 'packages');
    if (fsExistsSync(packagesDir)) {
        const packages = fsReaddirSync(packagesDir);
        return Promise.all(
            packages.map((name) => {
                const pkgPath = path.join(packagesDir, name);
                return executeAsync('npm i', { cwd: pkgPath });
            })
        );
    }
    return true;
};

export const taskRnvPkg: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPkg');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PKG, originTask);

    let args = [...Context.getContext().program.rawArgs];
    args = args.slice(3);

    const firstArg = args[0];
    const secondArg = args[1];

    switch (firstArg) {
        case 'version':
            // sets the given version to all of the packages, if there are any
            if (!secondArg) {
                return logError('No version specified', false, true);
            }
            if (!semver.valid(secondArg)) {
                return logError(`Invalid version specified ${secondArg}`, false, true);
            }
            return bumpVersions(secondArg);
        case 'publish':
            return publishAll();
        default:
            logError(`Unknown argument ${firstArg}`, false, true);
            break;
    }
};

export default {
    description: '',
    fn: taskRnvPkg,
    task: TASK_PKG,
    params: PARAMS.withBase(),
    platforms: [],
};
