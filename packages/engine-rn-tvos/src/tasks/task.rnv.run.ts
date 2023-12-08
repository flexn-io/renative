import {
    RnvTaskFn,
    TVOS,
    TASK_RUN,
    ANDROID_TV,
    FIRE_TV,
    TASK_CONFIGURE,
    PARAMS,
    getConfigProp,
    logTask,
    logSummary,
    logRaw,
    logErrorPlatform,
    executeOrSkipTask,
    shouldSkipTask,
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

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            // eslint-disable-next-line no-case-declarations
            const runDevice = await getAndroidDeviceToRunOn(c);
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
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
        case TVOS:
            // eslint-disable-next-line no-case-declarations
            const runDeviceArgs = await getIosDeviceToRunOn(c);
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
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

const Task = {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: TASK_RUN,
    dependencies: {
        before: TASK_CONFIGURE,
    },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};

export default Task;
