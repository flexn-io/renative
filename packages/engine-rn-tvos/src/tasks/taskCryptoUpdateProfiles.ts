import {
    RnvTaskFn,
    listAppConfigsFoldersSync,
    chalk,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { updateProfile } from '@rnv/sdk-apple';

const _updateProfile = (v: string) =>
    new Promise<void>((resolve, reject) => {
        logTask(`_updateProfile:${v}`, chalk().grey);
        updateProfile()
            .then(() => resolve())
            .catch((e) => reject(e));
    });

const _updateProfiles = () => {
    logTask('_updateProfiles', chalk().grey);
    const acList = listAppConfigsFoldersSync(true);

    return acList.reduce((previousPromise, v) => previousPromise.then(() => _updateProfile(v)), Promise.resolve());
};

const taskCryptoUpdateProfiles: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoUpdateProfiles');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoUpdateProfiles, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoUpdateProfiles, originTask)) return true;

    switch (c.platform) {
        case 'tvos':
            await _updateProfiles();
            break;
        default:
            return true;
    }
    return Promise.reject(`updateProfiles: Platform ${c.platform} not supported`);
};

const Task: RnvTask = {
    description: 'Will attempt to update all provisioning profiles (mac only)',
    fn: taskCryptoUpdateProfiles,
    task: RnvTaskName.cryptoUpdateProfiles,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['tvos'],
    // skipPlatforms: true,
};

export default Task;
