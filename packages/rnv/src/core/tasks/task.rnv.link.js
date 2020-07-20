import path from 'path';
import { doResolve } from '../resolve';
import { logWarning } from '../systemManager/logger';
import {
    copyFolderContentsRecursiveSync, fsExistsSync, fsReadFileSync
} from '../systemManager/fileutils';

export const taskRnvLink = c => new Promise((resolve) => {
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
        resolve();
    }
});
