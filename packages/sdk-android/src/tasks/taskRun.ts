import {
    logTask,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    logRaw,
    getConfigProp,
    logSummary,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { getAndroidDeviceToRunOn, packageAndroid, runAndroid } from '../runner';
import { SdkPlatforms } from '../constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} hosted:${hosted}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);

    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    const bundleAssets = getConfigProp('bundleAssets', false);

    const runDevice = await getAndroidDeviceToRunOn();
    if (runDevice) {
        c.runtime.target = runDevice?.name || runDevice?.udid;
    }
    if (!c.program.only) {
        await startBundlerIfRequired(RnvTaskName.run, originTask);
        if (bundleAssets || platform === 'androidwear') {
            await packageAndroid();
        }
        await runAndroid(runDevice!);
        if (!bundleAssets) {
            logSummary({ header: 'BUNDLER STARTED' });
        }
        return waitForBundlerIfRequired();
    }
    return runAndroid(runDevice!);
};

const taskRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your rn app on target device or emulator',
    fn,
    fnHelp: taskRunHelp,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
};

export default Task;
