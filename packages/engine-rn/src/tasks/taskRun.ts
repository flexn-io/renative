import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    logRaw,
    getConfigProp,
    logSummary,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { packageAndroid, runAndroid, getAndroidDeviceToRunOn } from '@rnv/sdk-android';
import { runXcodeProject, getIosDeviceToRunOn } from '@rnv/sdk-apple';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';

const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} hosted:${hosted}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.run, originTask);

    if (shouldSkipTask(c, TaskKey.run, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case 'ios':
        case 'macos':
            // eslint-disable-next-line no-case-declarations
            const runDeviceArgs = await getIosDeviceToRunOn(c);
            if (!c.program.only) {
                await startBundlerIfRequired(c, TaskKey.run, originTask);
                await runXcodeProject(c, runDeviceArgs);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runXcodeProject(c, runDeviceArgs);
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            // eslint-disable-next-line no-case-declarations
            const runDevice = await getAndroidDeviceToRunOn(c);
            if (runDevice) {
                c.runtime.target = runDevice?.name || runDevice?.udid;
            }
            if (!c.program.only) {
                await startBundlerIfRequired(c, TaskKey.run, originTask);
                if (bundleAssets || platform === 'androidwear') {
                    await packageAndroid(c);
                }
                await runAndroid(c, runDevice!);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c, runDevice!);
        default:
            return logErrorPlatform(c);
    }
};

const taskRnvRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your rn app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: TaskKey.run,
    // dependencies: {
    //     before: TaskKey.configure,
    // },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
