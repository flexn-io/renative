import path from 'path';
import { getContext } from '../context/provider';
import { logTask } from '../logger';
import { fsExistsSync } from '../system/fs';

export const generateLocalJsonSchemas = async () => {
    logTask('generateLocalJsonSchemas');
    const ctx = getContext();
    const dotRnvPath = path.join(ctx.paths.project.dir, '.rnv');
    console.log('DKJDKLDJLDKDJAA', dotRnvPath);

    if (fsExistsSync(dotRnvPath)) {
        console.log('DKJDKLDJLDKDJ');
    }
    return true;
};
