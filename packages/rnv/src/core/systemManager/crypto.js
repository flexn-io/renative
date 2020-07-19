/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import {
    chalk,
    logWarning,
    logTask,
    logDebug,
} from './logger';
import { isSystemWin } from '../utils';
import {
    getRealPath,
} from './fileutils';
import { rnvCryptoDecrypt } from '../tasks/task.rnv.crypto.decrypt';

export const getEnvExportCmd = (envVar, key) => {
    if (isSystemWin) {
        return `${chalk().white(`setx ${envVar} "${key}"`)}`;
    }
    return `${chalk().white(`export ${envVar}="${key}"`)}`;
};

export const getEnvVar = (c) => {
    const p1 = c.paths.workspace.dir
        .split('/')
        .pop()
        .replace('.', '');
    const p2 = c.files.project.package.name
        .replace('@', '')
        .replace('/', '_')
        .replace(/-/g, '_');
    const envVar = `CRYPTO_${p1}_${p2}`.toUpperCase();
    logDebug('encrypt looking for env var:', envVar);
    return envVar;
};


export const checkCrypto = async (c) => {
    logTask('checkCrypto');

    if (c.program.ci) return;

    const sourceRaw = c.files.project.config?.crypto?.decrypt?.source;
    const destRaw = c.files.project.config?.crypto?.encrypt?.dest;

    if (destRaw) {
        if (sourceRaw && destRaw) {
            const source = `${getRealPath(c, sourceRaw, 'decrypt.source')}`;
            const tsProjectPath = `${source}.timestamp`;
            const wsPath = path.join(
                c.paths.workspace.dir,
                c.files.project.package.name
            );
            const tsWorkspacePath = path.join(wsPath, 'timestamp');
            if (!fs.existsSync(source)) {
                logWarning(
                    "This project uses encrypted files but you don't have them installed"
                );
            } else {
                let tsWorkspace = 0;
                let tsProject = 0;
                if (fs.existsSync(tsWorkspacePath)) {
                    tsWorkspace = parseInt(
                        fs.readFileSync(tsWorkspacePath).toString(),
                        10
                    );
                }

                if (fs.existsSync(tsProjectPath)) {
                    tsProject = parseInt(
                        fs.readFileSync(tsProjectPath).toString(),
                        10
                    );
                }

                if (tsProject > tsWorkspace) {
                    logWarning(`Your ${tsWorkspacePath} is out of date.
project timestamp: ${chalk().grey(`${tsProject} - ${new Date(tsProject)}`)}
workspace timestamp: ${chalk().grey(`${tsWorkspace} - ${new Date(tsWorkspace)}`)}
you should run decrypt`);
                    await rnvCryptoDecrypt(c);
                    return;
                }

                if (tsProject < tsWorkspace) {
                    logWarning(
                        `Your ${tsWorkspacePath} is newer than your project one.`
                    );
                }
            }
        }
    }
};
