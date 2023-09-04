import {
    logErrorPlatform,
    logTask,
    TASK_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    TASK_PACKAGE,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
    getConfigProp,
} from 'rnv';
import { packageAndroid } from '@rnv/sdk-android';
import { packageBundleForXcode } from '@rnv/sdk-apple';

export const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    if (shouldSkipTask(c, TASK_PACKAGE, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    switch (platform) {
        case IOS:
        case MACOS:
            return packageBundleForXcode(c);
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return packageAndroid(c);
        default:
            logErrorPlatform(c);
            return false;
    }
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: 'package',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};
