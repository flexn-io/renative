import { getConfigProp, logSummary, createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { getAndroidDeviceToRunOn, packageAndroid, runAndroid } from '../runner';
import { SdkPlatforms } from '../constants';
import { TaskOptions } from '../taskOptions';

export default createTask({
    description: 'Run your rn app on target device or emulator',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx, originTaskName }) => {
        const bundleAssets = getConfigProp('bundleAssets');

        const runDevice = await getAndroidDeviceToRunOn();
        if (runDevice) {
            ctx.runtime.target = runDevice?.name || runDevice?.udid;
        }
        if (!ctx.program.opts().only) {
            await startBundlerIfRequired(RnvTaskName.run, originTaskName);
            if (bundleAssets || ctx.platform === 'androidwear') {
                await packageAndroid();
            }
            await runAndroid(runDevice!);
            if (!bundleAssets) {
                logSummary({ header: 'BUNDLER STARTED' });
            }
            return waitForBundlerIfRequired();
        }
        await runAndroid(runDevice!);
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: [
        ...RnvTaskOptionPresets.withConfigure(),
        ...RnvTaskOptionPresets.withRun(),
        TaskOptions.resetAdb,
        TaskOptions.skipTargetCheck,
    ],
    platforms: SdkPlatforms,
});
