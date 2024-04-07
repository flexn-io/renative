import { fsExistsSync, writeFileSync, readObjectSync, mkdirSync } from '../system/fs';
import { getContext } from '../context/provider';
import path from 'path';
import { chalk, logDefault, logDebug, logInfo, logWarning } from '../logger';
import type { RnvContext } from '../context/types';
import { generateOptions, inquirerPrompt } from '../api';
import type { ConfigFileWorkspace, ConfigFileWorkspaces } from '../schema/types';

export const createWorkspace = async (workspaceID: string, workspacePath: string) => {
    const c = getContext();
    const cnf = c.files.dotRnv.configWorkspaces;

    if (!cnf) return;

    cnf.workspaces[workspaceID] = {
        path: workspacePath,
    };

    const workspaceConfig = {
        // sdks: c.files.defaultWorkspace?.config?.sdks,
        // defaultTargets: c.files.defaultWorkspace?.config?.defaultTargets,
        // TODO: use empty default?
        sdks: {},
        defaultTargets: {},
    };

    mkdirSync(workspacePath);
    writeFileSync(path.join(workspacePath, 'renative.json'), workspaceConfig);

    writeFileSync(c.paths.dotRnv.configWorkspaces, cnf);
    return true;
};

export const getWorkspaceDirPath = async (c: RnvContext) => {
    logDefault('getWorkspaceDirPath');
    const wss = c.files.dotRnv.configWorkspaces;
    const ws = c.runtime.selectedWorkspace || c.buildConfig?.workspaceID;
    let dirPath;
    if (wss?.workspaces && ws) {
        dirPath = wss.workspaces[ws]?.path;
        if (!dirPath) {
            const wsDir = path.join(c.paths.user.homeDir, `.${ws}`);
            if (fsExistsSync(wsDir)) {
                wss.workspaces[ws] = {
                    path: wsDir,
                };
                writeFileSync(c.paths.dotRnv.configWorkspaces, wss);
                logInfo(
                    `Found workspace id ${ws} and compatible directory ${wsDir}. Your ${c.paths.dotRnv.configWorkspaces} has been updated.`
                );
            } else if (!c.runtime.isWSConfirmed || c.program.opts().ci === true) {
                let confirm = true;
                if (c.program.opts().ci !== true) {
                    const { conf } = await inquirerPrompt({
                        name: 'conf',
                        type: 'confirm',
                        message: `Your project belongs to workspace ${chalk().bold(
                            ws
                        )}. do you want to add new workspace ${chalk().bold(ws)} to your local system at ${chalk().bold(
                            wsDir
                        )}?`,
                        warningMessage: 'No app configs found for this project',
                    });
                    confirm = conf;
                    c.runtime.isWSConfirmed = true;
                }
                if (confirm) {
                    await createWorkspace(ws, wsDir);
                }
            }
        }
    }

    if (!dirPath) {
        return c.paths.dotRnv.dir;
    }
    return dirPath;
};

export const getWorkspaceConnectionString = (obj?: ConfigFileWorkspaces['workspaces'][string]) => {
    const remoteUrl = obj?.remote?.url;
    const connectMsg = remoteUrl ? chalk().green(`(${obj.remote?.type}:${remoteUrl})`) : '';
    return connectMsg;
};

export const getWorkspaceOptions = () => {
    const c = getContext();
    return generateOptions(c.files.dotRnv.configWorkspaces?.workspaces, false, null, (i, obj, mapping, defaultVal) => {
        logDebug('getWorkspaceOptions');

        return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)} ${getWorkspaceConnectionString(obj)}\n`;
    });
};

export const loadWorkspacesConfigSync = () => {
    const c = getContext();
    // CHECK WORKSPACES
    if (fsExistsSync(c.paths.dotRnv.configWorkspaces)) {
        logDebug(`${c.paths.dotRnv.configWorkspaces} file exists!`);

        const cnf = readObjectSync<ConfigFileWorkspaces>(c.paths.dotRnv.configWorkspaces);

        if (!cnf) return;

        c.files.dotRnv.configWorkspaces = cnf;

        if (!cnf.workspaces) {
            cnf.workspaces = {};
        }
        if (Object.keys(cnf.workspaces).length === 0) {
            logWarning(`No workspace found in ${c.paths.dotRnv.configWorkspaces}. Creating default rnv one for you`);
            cnf.workspaces = {
                rnv: {
                    path: c.paths.workspace.dir,
                },
            };
            writeFileSync(c.paths.dotRnv.configWorkspaces, cnf);
        }
    } else {
        logWarning(`Cannot find ${c.paths.dotRnv.configWorkspaces}. creating one..`);
        c.files.dotRnv.configWorkspaces = {
            workspaces: {
                rnv: {
                    path: c.paths.workspace.dir,
                },
            },
        };
        writeFileSync(c.paths.dotRnv.configWorkspaces, c.files.dotRnv.configWorkspaces);
    }

    const defWsPath = c.paths.dotRnv.config;

    if (defWsPath && fsExistsSync(defWsPath)) {
        c.files.dotRnv.config = readObjectSync<ConfigFileWorkspace>(defWsPath) || {};
    }
};
