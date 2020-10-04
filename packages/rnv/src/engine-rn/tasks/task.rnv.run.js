import { getConfigProp } from '../../core/common';
import { logErrorPlatform } from '../../core/platformManager';
import { logTask, logSummary, logRaw } from '../../core/systemManager/logger';
import { IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_RUN,
    TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { runXcodeProject } from '../../sdk-xcode';
import { packageAndroid, runAndroid } from '../../sdk-android';
import { executeOrSkipTask } from '../../core/engineManager';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '../commonEngine';

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case IOS:
        case TVOS:
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
        case ANDROID_WEAR:
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
                if (bundleAssets || platform === ANDROID_WEAR) {
                    await packageAndroid(c);
                }
                await runAndroid(c, target);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c, target);
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
    task: 'run',
    dependencies: {
        before: TASK_CONFIGURE
    },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};

export default Task;
