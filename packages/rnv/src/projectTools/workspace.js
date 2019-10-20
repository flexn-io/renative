import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { generateOptions, inquirerPrompt } from '../systemTools/prompt';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand, logToSummary
} from '../systemTools/logger';
import { writeObjectSync, mkdirSync } from '../systemTools/fileutils';

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
    c.files.rnv.configWorkspaces.workspaces[workspaceID] = {
        path: workspacePath
    };

    const workspaceConfig = {
        sdks: c.files.defaultWorkspace?.config?.sdks,
        defaultTargets: c.files.defaultWorkspace?.config?.defaultTargets,
    };

    mkdirSync(workspacePath);
    writeObjectSync(path.join(workspacePath, 'renative.json'), workspaceConfig);

    writeObjectSync(c.paths.rnv.configWorkspaces, c.files.rnv.configWorkspaces);
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
