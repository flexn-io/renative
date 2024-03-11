import {
    logErrorPlatform,
    logTask,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    getConfigProp,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { packageAndroid } from '@rnv/sdk-android';
import { packageBundleForXcode } from '@rnv/sdk-apple';

const taskPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.package, originTask);

    if (shouldSkipTask(RnvTaskName.package, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    switch (platform) {
        case 'ios':
        case 'macos':
            return packageBundleForXcode();
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear': {
            // NOTE: react-native v0.73 triggers packaging automatically so we skipping it unless we need to
            // package it explicitly for tasks where it is not triggered automatically

            const signingConfig = getConfigProp(c, c.platform, 'signingConfig');

            if (originTask === RnvTaskName.eject || signingConfig !== 'Release') {
                //if bundleAssets === true AND signingConfig is not releaase RN will not trigger packaging
                return packageAndroid();
            }
            return true;
        }
        default:
            logErrorPlatform();
            return false;
    }
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskPackage,
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
