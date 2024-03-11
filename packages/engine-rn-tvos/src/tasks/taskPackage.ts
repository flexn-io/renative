import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    getConfigProp,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { packageAndroid } from '@rnv/sdk-android';
import { packageBundleForXcode } from '@rnv/sdk-apple';

const taskPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.package, originTask);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    if (shouldSkipTask(RnvTaskName.package, originTask)) return true;

    switch (platform) {
        case 'androidtv':
        case 'firetv': {
            // NOTE: react-native v0.73 triggers packaging automatically so we skipping it unless we need to
            // package it explicitly for tasks where it is not triggered automatically
            const signingConfig = getConfigProp(c, c.platform, 'signingConfig');

            if (originTask === RnvTaskName.eject || signingConfig !== 'Release') {
                return packageAndroid();
            }
            return true;
        }
        case 'tvos':
            return packageBundleForXcode();
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
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
