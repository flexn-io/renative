import { getContext, logInfo } from '@rnv/core';

export const isOfflineMode = (logMessage?: string) => {
    if (getContext().program.opts().offline) {
        if (logMessage) {
            logInfo(`Skipping "${logMessage}" due to --offline option`);
        }
        return true;
    } else {
        return false;
    }
};
