import {
    RnvTaskName,
    chalk,
    executeTask,
    fsExistsSync,
    fsReadFileSync,
    getContext,
    getRealPath,
    isSystemWin,
    logDebug,
    logError,
    logTask,
    logWarning,
} from '@rnv/core';
import path from 'path';

export const getEnvExportCmd = (envVar: string, key: string) => {
    if (isSystemWin) {
        return `${chalk().bold(`setx ${envVar} "${key}"`)}`;
    }
    return `${chalk().bold(`export ${envVar}="${key}"`)}`;
};

export const getEnvVar = () => {
    const c = getContext();
    if (!c.files.project.package.name) {
        logError('package.json requires `name` field. cannot generate ENV variables for crypto');
        return;
    }
    const splitDelimiter = isSystemWin ? '\\' : '/';

    const p1 = c.paths.workspace.dir.split(splitDelimiter).pop()?.replace?.('.', '');
    const p2 = c.files.project.package.name.replace('@', '').replace('/', '_').replace(/-/g, '_');
    const envVar = `CRYPTO_${p1}_${p2}`.toUpperCase();
    logDebug('encrypt looking for env var:', envVar);
    return envVar;
};

export const checkCrypto = async (parentTaskName?: string, originTaskName?: string) => {
    const c = getContext();
    logTask('checkCrypto');

    if (c.program.opts().ci || c.files.project.config?.crypto?.isOptional) return;

    const sourceRaw = c.files.project.config?.crypto?.path;
    if (!c.files.project.package.name) {
        logError('package.json requires `name` field. cannot check crypto');
        return;
    }

    if (sourceRaw) {
        const source = `${getRealPath(sourceRaw, 'crypto.path')}`;
        const tsProjectPath = `${source}.timestamp`;
        const wsPath = path.join(c.paths.workspace.dir, c.files.project.package.name);
        const tsWorkspacePath = path.join(wsPath, 'timestamp');
        if (!fsExistsSync(source)) {
            logWarning("This project uses encrypted files but you don't have them installed");
        } else {
            let tsWorkspace = 0;
            let tsProject = 0;
            if (fsExistsSync(tsWorkspacePath)) {
                tsWorkspace = parseInt(fsReadFileSync(tsWorkspacePath).toString(), 10);
            }

            if (fsExistsSync(tsProjectPath)) {
                tsProject = parseInt(fsReadFileSync(tsProjectPath).toString(), 10);
            }

            if (tsProject > tsWorkspace) {
                logWarning(`Your ${tsWorkspacePath} is out of date.
project timestamp: ${chalk().grey(`${tsProject} - ${new Date(tsProject)}`)}
workspace timestamp: ${chalk().grey(`${tsWorkspace} - ${new Date(tsWorkspace)}`)}
you should run decrypt`);
                await executeTask({ taskName: RnvTaskName.cryptoDecrypt, parentTaskName, originTaskName });
                return;
            }

            if (tsProject < tsWorkspace) {
                logWarning(`Your ${tsWorkspacePath} is newer than your project one.`);
            }
        }
    }
};
