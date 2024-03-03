import {
    RnvTaskFn,
    TaskKey.run,
    TaskKey.configure,
    PARAMS,
    getConfigProp,
    logTask,
    logSummary,
    logRaw,
    logErrorPlatform,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { packageAndroid, runAndroid, getAndroidDeviceToRunOn } from '@rnv/sdk-android';
import { runXcodeProject, getIosDeviceToRunOn } from '@rnv/sdk-apple';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.run, originTask);

    if (shouldSkipTask(c, TaskKey.run, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case 'androidtv':
        case 'firetv':
            // eslint-disable-next-line no-case-declarations
            const runDevice = await getAndroidDeviceToRunOn(c);
            if (!c.program.only) {
                await startBundlerIfRequired(c, TaskKey.run, originTask);
                if (bundleAssets) {
                    await packageAndroid(c);
                }
                await runAndroid(c, runDevice!);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c, runDevice!);
        case 'tvos':
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
        default:
            return logErrorPlatform(c);
    }
};

export const taskRnvRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your tv app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: TaskKey.run,
    // dependencies: {
    //     before: TaskKey.configure,
    // },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
