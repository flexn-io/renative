import { getConfigProp, logSummary, RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { getIosDeviceToRunOn, runXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Run your rn app on target device or emulator',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx, originTaskName }) => {
        const bundleAssets = getConfigProp('bundleAssets', false);

        const runDeviceArgs = await getIosDeviceToRunOn(ctx);
        if (!ctx.program.opts().only) {
            await startBundlerIfRequired(RnvTaskName.run, originTaskName);
            await runXcodeProject(runDeviceArgs);
            if (!bundleAssets) {
                logSummary({ header: 'BUNDLER STARTED' });
            }
            return waitForBundlerIfRequired();
        }
        return runXcodeProject(runDeviceArgs);
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
};


