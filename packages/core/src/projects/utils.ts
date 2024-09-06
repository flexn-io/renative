import path from 'path';
import { RnvContext } from '../context/types';
import { resolvePackage } from '../system/fs';
import { getContext } from '../context/provider';
import { logInfo } from '../logger';

export const resolveRelativePackage = (c: RnvContext, v: string) => {
    if (v?.startsWith?.('./')) {
        return path.join(c.paths.project.dir, v);
    }
    return resolvePackage(v);
};

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
