import path from 'path';
import { RnvContext } from '../context/types';
import { resolvePackage } from '../system/fs';

export const resolveRelativePackage = (c: RnvContext, v: string) => {
    if (v?.startsWith?.('./')) {
        return path.join(c.paths.project.dir, v);
    }
    return resolvePackage(v);
};
