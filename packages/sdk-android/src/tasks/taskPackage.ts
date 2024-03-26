import { getConfigProp, RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { packageAndroid } from '../runner';
import { SdkPlatforms } from '../constants';

const Task: RnvTask = {
    description: 'Package source files into bundle',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ originTaskName }) => {
        const bundleAssets = getConfigProp('bundleAssets');
        if (!bundleAssets) {
            return true;
        }
        // NOTE: react-native v0.73 triggers packaging automatically so we skipping it unless we need to
        // package it explicitly for tasks where it is not triggered automatically
        const signingConfig = getConfigProp('signingConfig');

        if (originTaskName === RnvTaskName.eject || signingConfig !== 'Release') {
            //if bundleAssets === true AND signingConfig is not releaase RN will not trigger packaging
            return packageAndroid();
        }
        return true;
    },
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
