import { getConfigProp } from '../core/common';
import { logErrorPlatform } from '../core/platformManager';
import { logTask, logSummary } from '../core/systemManager/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_RUN,
    TASK_CONFIGURE,
} from '../core/constants';
import { runXcodeProject } from '../sdk-xcode';
import { packageAndroid, runAndroid } from '../sdk-android';
import { executeTask } from '../core/engineManager';
import { startBundlerIfRequired, waitForBundlerIfRequired } from './commonEngine';

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    await executeTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

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
                if (
                    getConfigProp(c, platform, 'bundleAssets') === true
                  || platform === ANDROID_WEAR
                ) {
                    await packageAndroid(c, platform);
                }
                await runAndroid(c, platform, target);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c, platform, target);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    task: 'run',
    params: [],
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
