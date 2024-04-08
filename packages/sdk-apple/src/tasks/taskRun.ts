import { getConfigProp, logSummary, createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { getIosDeviceToRunOn, runXcodeProject } from '../runner';
import { SDKTaskOptionPresets, SdkPlatforms } from '../common';

export default createTask({
    description: 'Run your rn app on target device or emulator',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx, originTaskName }) => {
        const bundleAssets = getConfigProp('bundleAssets');

        const runDeviceArgs = await getIosDeviceToRunOn(ctx);
        if (!ctx.program.opts().only) {
            await startBundlerIfRequired(RnvTaskName.run, originTaskName);
            await runXcodeProject(runDeviceArgs);
            if (!bundleAssets) {
                logSummary({ header: 'BUNDLER STARTED' });
            }
            return waitForBundlerIfRequired();
        }
        await runXcodeProject(runDeviceArgs);
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: SDKTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
});
