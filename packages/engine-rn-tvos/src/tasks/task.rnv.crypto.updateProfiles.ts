import {
    RnvTaskFn,
    RnvContext,
    listAppConfigsFoldersSync,
    chalk,
    logTask,
    TaskKey.cryptoUpdateProfiles,
    TaskKey.projectConfigure,
    PARAMS,
    executeTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

const _updateProfile = (c: RnvContext, v: string) =>
    new Promise<void>((resolve, reject) => {
        logTask(`_updateProfile:${v}`, chalk().grey);
        updateProfile(c)
            .then(() => resolve())
            .catch((e) => reject(e));
    });

const _updateProfiles = (c: RnvContext) => {
    logTask('_updateProfiles', chalk().grey);
    const acList = listAppConfigsFoldersSync(c, true);

    return acList.reduce((previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)), Promise.resolve());
};

export const taskRnvCryptoUpdateProfiles: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfiles');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.cryptoUpdateProfiles, originTask);

    if (shouldSkipTask(c, TaskKey.cryptoUpdateProfiles, originTask)) return true;

    switch (c.platform) {
        case 'tvos':
            await _updateProfiles(c);
            break;
        default:
            return true;
    }
    return Promise.reject(`updateProfiles: Platform ${c.platform} not supported`);
};

const Task: RnvTask = {
    description: 'Will attempt to update all provisioning profiles (mac only)',
    fn: taskRnvCryptoUpdateProfiles,
    task: TaskKey.cryptoUpdateProfiles,
    params: PARAMS.withBase(),
    platforms: ['tvos'],
    // skipPlatforms: true,
};

export default Task;
