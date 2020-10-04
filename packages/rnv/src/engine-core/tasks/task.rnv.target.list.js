import { isPlatformSupported } from '../../core/platformManager';
import { chalk, logTask } from '../../core/systemManager/logger';
import {
    listAndroidTargets,
} from '../../sdk-android/deviceManager';
import { checkSdk } from '../../core/sdkManager';
import { IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH,
    PARAMS } from '../../core/constants';
import { listTizenTargets } from '../../sdk-tizen';
import { listWebOSTargets } from '../../sdk-webos';
import { listAppleDevices } from '../../sdk-xcode/deviceManager';
import { executeTask } from '../../core/engineManager';


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
        case TIZEN:
            return listTizenTargets(c, platform);
        case WEBOS:
            return listWebOSTargets(c);
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
