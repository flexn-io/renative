import { fsExistsSync, writeFileSync, readObjectSync, mkdirSync } from '../system/fs';

import { getContext } from '../context/provider';

import path from 'path';
import { chalk, logTask, logDebug, logInfo, logWarning } from '../logger';
import { RnvContext } from '../context/types';
import { generateOptions, inquirerPrompt } from '../api';
import { ConfigFileWorkspace, ConfigFileWorkspaces } from '../schema/configFiles/types';

export const createWorkspace = async (c: RnvContext, workspaceID: string, workspacePath: string) => {
    const cnf = c.files.rnv.configWorkspaces;

    if (!cnf) return;

    cnf.workspaces[workspaceID] = {
        path: workspacePath,
    };

    const workspaceConfig = {
        sdks: c.files.defaultWorkspace?.config?.sdks,
        defaultTargets: c.files.defaultWorkspace?.config?.defaultTargets,
    };

    mkdirSync(workspacePath);
    writeFileSync(path.join(workspacePath, 'renative.json'), workspaceConfig);

    writeFileSync(c.paths.rnv.configWorkspaces, cnf);
    return true;
};

export const getWorkspaceDirPath = async (c: RnvContext) => {
    logTask('getWorkspaceDirPath');
    const wss = c.files.rnv.configWorkspaces;
    const ws = c.runtime.selectedWorkspace || c.buildConfig?.workspaceID;
    let dirPath;
    if (wss?.workspaces && ws) {
        dirPath = wss.workspaces[ws]?.path;
        if (!dirPath) {
            const wsDir = path.join(c.paths.home.dir, `.${ws}`);
            if (fsExistsSync(wsDir)) {
                wss.workspaces[ws] = {
                    path: wsDir,
                };
                writeFileSync(c.paths.rnv.configWorkspaces, wss);
                logInfo(
                    `Found workspace id ${ws} and compatible directory ${wsDir}. Your ${c.paths.rnv.configWorkspaces} has been updated.`
                );
            } else if (!c.runtime.isWSConfirmed || c.program.ci === true) {
                let confirm = true;
                if (c.program.ci !== true) {
                    const { conf } = await inquirerPrompt({
                        name: 'conf',
                        type: 'confirm',
                        message: `Your project belongs to workspace ${chalk().white(
                            ws
                        )}. do you want to add new workspace ${chalk().white(
                            ws
                        )} to your local system at ${chalk().white(wsDir)}?`,
                        warningMessage: 'No app configs found for this project',
                    });
                    confirm = conf;
                    c.runtime.isWSConfirmed = true;
                }
                if (confirm) {
                    await createWorkspace(c, ws, wsDir);
                }
            }
        }
    }

    if (!dirPath) {
        return c.paths.GLOBAL_RNV_DIR;
    }
    return dirPath;
};

export const getWorkspaceConnectionString = (obj?: ConfigFileWorkspaces['workspaces'][string]) => {
    const remoteUrl = obj?.remote?.url;
    const connectMsg = remoteUrl ? chalk().green(`(${obj.remote?.type}:${remoteUrl})`) : '';
    return connectMsg;
};

export const getWorkspaceOptions = (c: RnvContext) =>
    generateOptions(c.files.rnv.configWorkspaces?.workspaces, false, null, (i, obj, mapping, defaultVal) => {
        logDebug('getWorkspaceOptions');

        return ` [${chalk().grey(i + 1)}]> ${chalk().bold(defaultVal)} ${getWorkspaceConnectionString(obj)}\n`;
    });

export const loadWorkspacesConfigSync = () => {
    const c = getContext();
    // CHECK WORKSPACES
    if (fsExistsSync(c.paths.rnv.configWorkspaces)) {
        logDebug(`${c.paths.rnv.configWorkspaces} file exists!`);

        const cnf = readObjectSync<ConfigFileWorkspaces>(c.paths.rnv.configWorkspaces);

        if (!cnf) return;

        c.files.rnv.configWorkspaces = cnf;

        if (!cnf.workspaces) {
            cnf.workspaces = {};
        }
        if (Object.keys(cnf.workspaces).length === 0) {
            logWarning(`No workspace found in ${c.paths.rnv.configWorkspaces}. Creating default rnv one for you`);
            cnf.workspaces = {
                rnv: {
                    path: c.paths.workspace.dir,
                },
            };
            writeFileSync(c.paths.rnv.configWorkspaces, cnf);
        }
    } else {
        logWarning(`Cannot find ${c.paths.rnv.configWorkspaces}. creating one..`);
        c.files.rnv.configWorkspaces = {
            workspaces: {
                rnv: {
                    path: c.paths.workspace.dir,
                },
            },
        };
        writeFileSync(c.paths.rnv.configWorkspaces, c.files.rnv.configWorkspaces);
    }

    const defWsPath = c.paths.GLOBAL_RNV_CONFIG;

    if (defWsPath && fsExistsSync(defWsPath)) {
        c.files.defaultWorkspace.config = readObjectSync<ConfigFileWorkspace>(defWsPath) || {};
    }
};
