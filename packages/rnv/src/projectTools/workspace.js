import {
    logWelcome, logSummary, configureLogger, logAndSave, logError, logTask,
    logWarning, logDebug, logInfo, logComplete, logSuccess, logEnd,
    logInitialize, logAppInfo, getCurrentCommand
} from '../systemTools/logger';

export const listWorkspaces = c => new Promise((resolve, reject) => {
    logTask('listWorkspaces');
    resolve();
});
