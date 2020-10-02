import path from 'path';
import {
    chalk,
    logWarning,
    logTask,
    logDebug,
} from './logger';
import { isSystemWin } from '../utils';
import {
    getRealPath,
    fsExistsSync,
    fsReadFileSync
} from './fileutils';
import { TASK_CRYPTO_DECRYPT } from '../constants';
import { executeTask } from '../engineManager';

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


export const checkCrypto = async (c, parentTask, originTask) => {
    logTask('checkCrypto');

    if (c.program.ci || c.files.project.config?.crypto?.optional) return;

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
            if (!fsExistsSync(source)) {
                logWarning(
                    "This project uses encrypted files but you don't have them installed"
                );
            } else {
                let tsWorkspace = 0;
                let tsProject = 0;
                if (fsExistsSync(tsWorkspacePath)) {
                    tsWorkspace = parseInt(
                        fsReadFileSync(tsWorkspacePath).toString(),
                        10
                    );
                }

                if (fsExistsSync(tsProjectPath)) {
                    tsProject = parseInt(
                        fsReadFileSync(tsProjectPath).toString(),
                        10
                    );
                }

                if (tsProject > tsWorkspace) {
                    logWarning(`Your ${tsWorkspacePath} is out of date.
project timestamp: ${chalk().grey(`${tsProject} - ${new Date(tsProject)}`)}
workspace timestamp: ${chalk().grey(`${tsWorkspace} - ${new Date(tsWorkspace)}`)}
you should run decrypt`);
                    await executeTask(c, TASK_CRYPTO_DECRYPT, parentTask, originTask);
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
