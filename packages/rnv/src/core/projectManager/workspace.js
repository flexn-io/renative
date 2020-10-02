import path from 'path';
import { generateOptions, inquirerPrompt } from '../../cli/prompt';
import {
    chalk,
    logTask,
    logWarning,
    logDebug,
    logInfo,
} from '../systemManager/logger';
import { writeFileSync, mkdirSync, fsExistsSync } from '../systemManager/fileutils';


export const createWorkspace = async (c, workspaceID, workspacePath) => {
    c.files.rnv.configWorkspaces.workspaces[workspaceID] = {
        path: workspacePath
    };

    const workspaceConfig = {
        sdks: c.files.defaultWorkspace?.config?.sdks,
        defaultTargets: c.files.defaultWorkspace?.config?.defaultTargets
    };

    mkdirSync(workspacePath);
    writeFileSync(path.join(workspacePath, 'renative.json'), workspaceConfig);

    writeFileSync(c.paths.rnv.configWorkspaces, c.files.rnv.configWorkspaces);
    return true;
};

export const getWorkspaceDirPath = async (c) => {
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
                    path: wsDir
                };
                writeFileSync(c.paths.rnv.configWorkspaces, wss);
                logInfo(
                    `Found workspace id ${ws} and compatible directory ${wsDir}. Your ${
                        c.paths.rnv.configWorkspaces} has been updated.`
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
                        warningMessage: 'No app configs found for this project'
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
    if (c.buildConfig?.paths?.globalConfigDir) {
        logWarning(
            `paths.globalConfigDir in ${
                c.paths.project.config
            } is DEPRECATED. use workspaceID instead. more info at https://renative.org/docs/workspaces`
        );
    }
    if (!dirPath) {
        return c.buildConfig?.paths?.globalConfigDir || c.paths.GLOBAL_RNV_DIR;
    }
    return dirPath;
};

export const getWorkspaceConnectionString = (obj) => {
    const remoteUrl = obj.remote?.url;
    const connectMsg = remoteUrl
        ? chalk().green(`(${obj.remote.type}:${remoteUrl})`)
        : '';
    return connectMsg;
};

export const getWorkspaceOptions = c => generateOptions(
        c.files.rnv.configWorkspaces?.workspaces,
        false,
        null,
        (i, obj, mapping, defaultVal) => {
            logDebug('getWorkspaceOptions');

            return ` [${chalk().grey(i + 1)}]> ${chalk().bold(
                defaultVal
            )} ${getWorkspaceConnectionString(obj)}\n`;
        }
);
