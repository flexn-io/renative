import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { generateOptions, inquirerPrompt } from '../systemTools/prompt';
import {
    logTask,
    logWarning, logDebug, logInfo,
    logToSummary
} from '../systemTools/logger';
import { writeFileSync, mkdirSync } from '../systemTools/fileutils';

export const rnvWorkspaceList = async (c) => {
    logTask('rnvWorkspaceList');


    const opts = generateOptions(c.files.rnv.configWorkspaces?.workspaces, true, null, (i, obj, mapping, defaultVal) => {
        const isConnected = '';
        return ` [${chalk.grey(i + 1)}]> ${chalk.bold(defaultVal)}${isConnected} \n`;
    });

    logToSummary(`Workspaces:\n\n${opts.asString}`);
};

export const rnvWorkspaceAdd = async (c) => {
    logTask('rnvWorkspaceAdd');

    const { workspace } = await inquirerPrompt({
        name: 'workspace',
        type: 'input',
        message: 'absolute path to new workspace',
        validate: i => !!i || 'No path provided'
    });

    const workspacePath = path.join(workspace);

    if (fs.existsSync(workspacePath)) {
        const { confirm } = await inquirerPrompt({
            name: 'confirm',
            type: 'confirm',
            message: `Folder ${workspacePath} already exists are you sure you want to override it?`,
        });
        if (!confirm) return;
    }

    let workspaceID = workspacePath.split('/').pop().replace(/@|\./g, '');

    const { workspaceIDInput } = await inquirerPrompt({
        name: 'workspaceIDInput',
        type: 'input',
        message: `ID of the workspace (${workspaceID})`
    });

    workspaceID = workspaceIDInput || workspaceID;
    createWorkspace(c, workspaceID, workspacePath);
};

export const createWorkspace = async (c, workspaceID, workspacePath) => {
    c.files.rnv.configWorkspaces.workspaces[workspaceID] = {
        path: workspacePath
    };

    const workspaceConfig = {
        sdks: c.files.defaultWorkspace?.config?.sdks,
        defaultTargets: c.files.defaultWorkspace?.config?.defaultTargets,
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
            if (fs.existsSync(wsDir)) {
                wss.workspaces[ws] = {
                    path: wsDir
                };
                writeFileSync(c.paths.rnv.configWorkspaces, wss);
                logInfo(`Found workspace id ${ws} and compatible directory ${wsDir}. Your ${c.paths.rnv.configWorkspaces} has been updated.`);
            } else if (!c.runtime.isWSConfirmed || c.program.ci === true) {
                let confirm = true;
                if (c.program.ci !== true) {
                    const { conf } = await inquirerPrompt({
                        name: 'conf',
                        type: 'confirm',
                        message: `Your project belongs to workspace ${chalk.white(
                            ws,
                        )}. do you want to add new workspace ${chalk.white(
                            ws,
                        )} to your local system at ${chalk.white(wsDir)}?`,
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
        logWarning(`paths.globalConfigDir in ${c.paths.project.config} is DEPRECATED. use workspaceID instead. more info at https://renative.org/docs/workspaces`);
    }
    if (!dirPath) {
        return c.buildConfig?.paths?.globalConfigDir || c.paths.GLOBAL_RNV_DIR;
    }
    return dirPath;
};

export const rnvWorkspaceConnect = async (c) => {
    logTask('rnvWorkspaceConnect');

    const opts = Object.keys(c.files.rnv.configWorkspaces?.workspaces).map(v => `${v} ${_getConnectionString(c.files.rnv.configWorkspaces?.workspaces[v])}`);

    const { selectedWS } = await inquirerPrompt({
        type: 'list',
        name: 'selectedWS',
        message: 'Pick a workspace',
        choices: opts
    });
};

const _getConnectionString = (obj) => {
    const remoteUrl = obj.remote?.url;
    const connectMsg = remoteUrl ? chalk.green(`(${obj.remote.type}:${remoteUrl})`) : '';
    return connectMsg;
};

export const rnvWorkspaceUpdate = async (c) => {
    logTask('rnvWorkspaceUpdate');
};


export const getWorkspaceOptions = c => generateOptions(c.files.rnv.configWorkspaces?.workspaces, false, null, (i, obj, mapping, defaultVal) => {
    logDebug('getWorkspaceOptions');

    return ` [${chalk.grey(i + 1)}]> ${chalk.bold(defaultVal)} ${_getConnectionString(obj)}\n`;
});
