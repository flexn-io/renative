import { getConfigProp, logSummary, createTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { getIosDeviceToRunOn, runXcodeProject } from '../runner';
import { SdkPlatforms } from '../common';
import { TaskOptions, TaskOptionPresets } from '../taskOptions';
import { Context } from '../getContext';

export default createTask({
    description: 'Run your rn app on target device or emulator',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx, originTaskName }) => {
        const bundleAssets = getConfigProp('bundleAssets');

        const runDeviceArgs = await getIosDeviceToRunOn(ctx as Context);
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
    options: [
        ...RnvTaskOptionPresets.withConfigure(),
        ...RnvTaskOptionPresets.withRun(),
        TaskOptions.skipTargetCheck,
        TaskOptions.uninstall,
        ...TaskOptionPresets.withConfigure(),
    ],
    platforms: SdkPlatforms,
});
