import { chalk, logTask } from '../../core/systemManager/logger';
import { listAppConfigsFoldersSync } from '../../core/configManager/configParser';
import { IOS, TVOS, TASK_CRYPTO_UPDATE_PROFILES, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { updateProfile } from '../../sdk-xcode/fastlane';
import { executeTask } from '../../core/engineManager';


const _updateProfile = (c, v) => new Promise((resolve, reject) => {
    logTask(`_updateProfile:${v}`, chalk().grey);
    updateProfile(c, v)
        .then(() => resolve())
        .catch(e => reject(e));
});

const _updateProfiles = (c) => {
    logTask('_updateProfiles', chalk().grey);
    const acList = listAppConfigsFoldersSync(c, true);

    return acList.reduce(
        (previousPromise, v) => previousPromise.then(() => _updateProfile(c, v)),
        Promise.resolve()
    );
};

export const taskRnvCryptoUpdateProfiles = async (c, parentTask, originTask) => {
    logTask('taskRnvCryptoUpdateProfiles');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_UPDATE_PROFILES, originTask);

    switch (c.platform) {
        case IOS:
        case TVOS:
            await _updateProfiles(c);
            break;
        default:
            return true;
    }
    return Promise.reject(
        `updateProfiles: Platform ${c.platform} not supported`
    );
};

export default {
    description: '',
    fn: taskRnvCryptoUpdateProfiles,
    task: TASK_CRYPTO_UPDATE_PROFILES,
    params: PARAMS.withBase(),
    platforms: [],
    skipPlatforms: true,
};
