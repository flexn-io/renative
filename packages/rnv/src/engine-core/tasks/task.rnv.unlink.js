import path from 'path';
import { logInfo, logTask } from '../../core/systemManager/logger';
import { PARAMS } from '../../core/constants';
import {
    fsExistsSync, fsRenameSync, fsUnlinkSync
} from '../../core/systemManager/fileutils';

export const taskRnvUnlink = async (c) => {
    logTask('taskRnvUnlink');

    const rnvPath = path.join(c.paths.project.nodeModulesDir, 'rnv');
    const rnvPathUnlinked = path.join(c.paths.project.nodeModulesDir, 'rnv_unlinked');


    if (!fsExistsSync(rnvPathUnlinked)) {
        logInfo('RNV is not linked');
    } else if (fsExistsSync(rnvPath)) {
        fsUnlinkSync(rnvPath);
        fsRenameSync(rnvPathUnlinked, rnvPath);
    }

    return true;
};

export default {
    description: '',
    fn: taskRnvUnlink,
    task: 'unlink',
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
    isGlobalScope: true
};
