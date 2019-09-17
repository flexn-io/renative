import chalk from 'chalk';
import { generateOptions } from '../systemTools/prompt';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand, logToSummary
} from '../systemTools/logger';

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
};

export const rnvWorkspaceConnect = async (c) => {
    logTask('rnvWorkspaceConnect');
};

export const rnvWorkspaceUpdate = async (c) => {
    logTask('rnvWorkspaceUpdate');
};


export const getWorkspaceOptions = c => generateOptions(c.files.rnv.configWorkspaces?.workspaces, false, null, (i, obj, mapping, defaultVal) => ` [${chalk.grey(i + 1)}]> ${chalk.bold(defaultVal)}\n`);
