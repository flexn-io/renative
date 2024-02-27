import {
    logErrorPlatform,
    logTask,
    TASK_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    TASK_PACKAGE,
    getConfigProp,
    RnvTask,
} from '@rnv/core';
import { packageAndroid } from '@rnv/sdk-android';
import { packageBundleForXcode } from '@rnv/sdk-apple';
import { TASK_EJECT } from './constants';

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
        case 'ios':
        case 'macos':
            return packageBundleForXcode(c);
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear': {
            // NOTE: react-native v0.73 triggers packaging automatically so we skipping it unless we need to
            // package it explicitly for tasks where it is not triggered automatically

            const signingConfig = getConfigProp(c, c.platform, 'signingConfig');

            if (originTask === TASK_EJECT || signingConfig !== 'Release') {
                //if bundleAssets === true AND signingConfig is not releaase RN will not trigger packaging
                return packageAndroid(c);
            }
            return true;
        }
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
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
