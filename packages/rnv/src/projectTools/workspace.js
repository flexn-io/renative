import chalk from 'chalk';
import { generateOptions } from '../systemTools/prompt';
import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from '../systemTools/logger';

export const rnvWorkspaceList = async (c) => {
    logTask('rnvWorkspaceList');
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


export const getWorkspaceOptions = c => generateOptions(c.files.configWorkspaces?.workspaces, false, null, (i, obj, mapping, defaultVal) => `-[${chalk.green(i + 1)}] ${chalk.green(defaultVal)}\n`);
