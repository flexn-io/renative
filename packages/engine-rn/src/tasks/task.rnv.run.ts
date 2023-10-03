import {
    logErrorPlatform,
    logTask,
    TASK_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    logRaw,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
    TASK_RUN,
    getConfigProp,
    logSummary,
} from '@rnv/core';
import { packageAndroid, runAndroid } from '@rnv/sdk-android';
import { runXcodeProject } from '@rnv/sdk-apple';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case IOS:
        case MACOS:
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
                await runXcodeProject(c);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runXcodeProject(c);
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
                if (bundleAssets || platform === ANDROID_WEAR) {
                    await packageAndroid(c);
                }
                await runAndroid(c);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c);
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
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};

export default Task;
