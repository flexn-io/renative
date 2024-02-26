import path from 'path';
import { getContext } from '../context/provider';
import { logInfo, logTask } from '../logger';
import { copyFolderContentsRecursiveSync, fsExistsSync, mkdirSync } from '../system/fs';

export const generateLocalJsonSchemas = async () => {
    logTask('generateLocalJsonSchemas');
    const ctx = getContext();

    if (!fsExistsSync(ctx.paths.project.dotRnvDir)) {
        logInfo(`.rnv folder missing. CREATING...DONE`);
        mkdirSync(ctx.paths.project.dotRnvDir);
    }

    const schemaDestDir = path.join(ctx.paths.project.dotRnvDir, 'schema');
    if (!fsExistsSync(schemaDestDir)) {
        logInfo(`.rnv/schemas folder missing. CREATING...DONE`);
        mkdirSync(schemaDestDir);
    }

    const schemaSourceDir = path.join(__dirname, '../../jsonSchema');
    copyFolderContentsRecursiveSync(schemaSourceDir, schemaDestDir);
    return true;
};
