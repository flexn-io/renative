import { RnvTaskOptionPresets, getConfigProp, createTask, RnvTaskName } from '@rnv/core';
import { SdkPlatforms } from '../sdk/constants';
import { packageBundleForWindows } from '../sdk';

export default createTask({
    description: 'Package source files into bundle',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        const bundleAssets = getConfigProp('bundleAssets');
        if (!bundleAssets) {
            return true;
        }
        return packageBundleForWindows();
    },
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
