import path from 'path';
import fs from 'fs';
import { logTask, logWarning } from '../common';
import { copyFolderContentsRecursiveSync } from '../fileutils';

const LINK = 'link';

// ##########################################
// PUBLIC API
// ##########################################

const run = (c) => {
    logTask('run');

    switch (c.command) {
    case LINK:
        return _link(c);
    default:
        return Promise.reject(`Command ${c.command} not supported`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _link = c => new Promise((resolve) => {
    if (fs.existsSync(c.paths.projectNpmLinkPolyfillPath)) {
        const l = JSON.parse(fs.readFileSync(c.paths.projectNpmLinkPolyfillPath).toString());
        Object.keys(l).forEach((key) => {
            // console.log('COPY', key, l[key]);
            const source = path.resolve(l[key]);
            const nm = path.join(source, 'node_modules');
            const dest = path.join(c.paths.projectNodeModulesFolder, key);
            if (fs.existsSync(source)) {
                copyFolderContentsRecursiveSync(source, dest, false, [nm]);
            } else {
                logWarning(`Source: ${source} doesn't exists!`);
            }
        });
    } else {
        logWarning(`${c.paths.projectNpmLinkPolyfillPath} file not found. nothing to link!`);
        resolve();
    }
});

export default run;
