import {
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    chalk,
    IOS,
    RnvContext,
    listAppConfigsFoldersSync,
    TASK_PROJECT_CONFIGURE,
    TASK_CRYPTO_UPDATE_PROFILES,
} from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

const _updateProfile = (c: RnvContext, v: string) =>
    new Promise<void>((resolve, reject) => {
        logTask(`_updateProfile:${v}`, chalk().grey);
        updateProfile(c)
            .then(() => resolve())
            .catch((e: any) => reject(e));
    });

const _updateProfiles = (c: RnvContext) => {
    logTask('_updateProfiles', chalk().grey);
    const acList = listAppConfigsFoldersSync(c, true);

    return acList.reduce((previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)), Promise.resolve());
};

export const taskRnvCryptoUpdateProfiles: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfiles');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_UPDATE_PROFILES, originTask);

    if (shouldSkipTask(c, TASK_CRYPTO_UPDATE_PROFILES, originTask)) return true;

    switch (c.platform) {
        case IOS:
            await _updateProfiles(c);
            break;
        default:
            return true;
    }
    return Promise.reject(`updateProfiles: Platform ${c.platform} not supported`);
};

export default {
    description: '',
    fn: taskRnvCryptoUpdateProfiles,
    task: TASK_CRYPTO_UPDATE_PROFILES,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
