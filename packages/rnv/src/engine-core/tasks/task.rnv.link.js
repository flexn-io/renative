import path from 'path';
import { doResolve } from '../../core/resolve';
import { logWarning, logTask } from '../../core/systemManager/logger';
import { PARAMS } from '../../core/constants';
import {
    copyFolderContentsRecursiveSync, fsExistsSync, fsReadFileSync
} from '../../core/systemManager/fileutils';

export const taskRnvLink = async (c) => {
    logTask('taskRnvLink');

    if (fsExistsSync(c.paths.project.npmLinkPolyfill)) {
        const l = JSON.parse(
            fsReadFileSync(c.paths.project.npmLinkPolyfill).toString()
        );
        Object.keys(l).forEach((key) => {
            const source = path.resolve(l[key]);
            const nm = path.join(source, 'node_modules');
            const dest = doResolve(key);
            if (fsExistsSync(source)) {
                copyFolderContentsRecursiveSync(source, dest, false, [nm]);
            } else {
                logWarning(`Source: ${source} doesn't exists!`);
            }
        });
    } else {
        logWarning(
            `${c.paths.project.npmLinkPolyfill} file not found. nothing to link!`
        );
    }
    return true;
};

export default {
    description: '',
    fn: taskRnvLink,
    task: 'link',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
