import { listAppConfigsFoldersSync, chalk, logTask, RnvTask, RnvTaskName } from '@rnv/core';
import { updateProfile } from '../fastlane';
import { SdkPlatforms } from '../common';

const _updateProfile = (v: string) =>
    new Promise<void>((resolve, reject) => {
        logTask(`_updateProfile:${v}`, chalk().grey);
        updateProfile()
            .then(() => resolve())
            .catch((e) => reject(e));
    });

const Task: RnvTask = {
    description: 'Will attempt to update all provisioning profiles (mac only)',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        const acList = listAppConfigsFoldersSync(true);

        return acList.reduce((previousPromise, v) => previousPromise.then(() => _updateProfile(v)), Promise.resolve());
    },
    task: RnvTaskName.cryptoUpdateProfiles,
    platforms: SdkPlatforms,
};

export default Task;
