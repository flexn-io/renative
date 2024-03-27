import { getConfigProp, createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { packageBundleForXcode } from '../runner';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Package source files into bundle',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        const bundleAssets = getConfigProp('bundleAssets');

        if (!bundleAssets) {
            return true;
        }

        return packageBundleForXcode();
    },
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
