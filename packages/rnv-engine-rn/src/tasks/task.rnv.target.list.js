import { PlatformManager, Logger, SDKManager, Constants, TaskManager } from 'rnv';

import { listAndroidTargets } from '../sdks/sdk-android/deviceManager';
import { listAppleDevices } from '../sdks/sdk-xcode/deviceManager';

const { isPlatformSupported } = PlatformManager;
const { chalk, logTask } = Logger;
const { checkSdk } = SDKManager;
const {
    IOS,
    ANDROID,
    TVOS,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH,
    PARAMS
} = Constants;
const { executeTask } = TaskManager;

export const taskRnvTargetList = async (c, parentTask, originTask) => {
    logTask('taskRnvTargetList');

    await isPlatformSupported(c);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH, originTask);

    const { platform } = c;

    await checkSdk(c);

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return listAndroidTargets(c, platform);
        case IOS:
        case TVOS:
            return listAppleDevices(c);
        default:
            return Promise.reject(
                `"target list" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. Working on it!`
            );
    }
};

export default {
    description: 'List all available devices / emulators for specific platform',
    fn: taskRnvTargetList,
    task: 'target list',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
