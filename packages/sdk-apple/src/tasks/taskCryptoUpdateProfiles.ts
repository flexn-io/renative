import {
    RnvTaskFn,
    listAppConfigsFoldersSync,
    chalk,
    logTask,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { updateProfile } from '../fastlane';
import { SdkPlatforms } from '../common';

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

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoUpdateProfiles');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoUpdateProfiles, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoUpdateProfiles, originTask)) return true;

    _updateProfiles();

    return true;
};

const Task: RnvTask = {
    description: 'Will attempt to update all provisioning profiles (mac only)',
    fn,
    task: RnvTaskName.cryptoUpdateProfiles,
    platforms: SdkPlatforms,
};

export default Task;
