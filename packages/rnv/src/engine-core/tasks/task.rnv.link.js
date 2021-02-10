import path from 'path';
import { logInfo, logTask } from '../../core/systemManager/logger';
import { PARAMS } from '../../core/constants';
import {
    fsExistsSync, fsRenameSync, fsSymlinkSync
} from '../../core/systemManager/fileutils';

export const taskRnvLink = async (c) => {
    logTask('taskRnvLink');

    const rnvPath = path.join(c.paths.project.nodeModulesDir, 'rnv');
    const rnvPathUnlinked = path.join(c.paths.project.nodeModulesDir, 'rnv_unlinked');


    if (fsExistsSync(rnvPathUnlinked)) {
        logInfo('RNV is already linked');
    } else if (fsExistsSync(rnvPath)) {
        fsRenameSync(rnvPath, rnvPathUnlinked);
        fsSymlinkSync(c.paths.rnv.dir, rnvPath);
    }

    return true;
};

export default {
    description: '',
    fn: taskRnvLink,
    task: 'link',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
    isGlobalScope: true
};
