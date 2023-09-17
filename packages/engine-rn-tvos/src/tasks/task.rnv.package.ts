import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_PACKAGE,
    TASK_CONFIGURE,
    PARAMS,
    getConfigProp,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';
import { packageAndroid } from '@rnv/sdk-android';
import { packageBundleForXcode } from '@rnv/sdk-apple';

export const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    if (shouldSkipTask(c, TASK_PACKAGE, originTask)) return true;

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            return packageAndroid(c);
        case TVOS:
            return packageBundleForXcode(c);
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
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
