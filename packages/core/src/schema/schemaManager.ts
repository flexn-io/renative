import { getContext } from '../context/provider';
import { logInfo, logTask } from '../logger';
import { fsExistsSync, mkdirSync } from '../system/fs';

export const generateLocalJsonSchemas = async () => {
    logTask('generateLocalJsonSchemas');
    const ctx = getContext();

    if (!fsExistsSync(ctx.paths.project.dotRnvDir)) {
        logInfo(`.rnv folder missing. CREATING...DONE`);
        mkdirSync(ctx.paths.project.dotRnvDir);
    }
    return true;
};
