import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TASK_PACKAGE,
    TASK_CONFIGURE,
    PARAMS,
    getConfigProp,
    executeOrSkipTask,
    shouldSkipTask,
    TASK_EJECT,
    RnvTask,
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
        case 'androidtv':
        case 'firetv': {
            // NOTE: react-native v0.73 triggers packaging automatically so we skipping it unless we need to
            // package it explicitly for tasks where it is not triggered automatically
            const signingConfig = getConfigProp(c, c.platform, 'signingConfig');

            if (originTask === TASK_EJECT || signingConfig !== 'Release') {
                return packageAndroid(c);
            }
            return true;
        }
        case 'tvos':
            return packageBundleForXcode(c);
        default:
            logErrorPlatform(c);
            return false;
    }
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: TASK_PACKAGE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
