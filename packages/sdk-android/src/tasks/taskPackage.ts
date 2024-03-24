import {
    logTask,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    getConfigProp,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { packageAndroid } from '../runner';
import { SdkPlatforms } from '../constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.package, originTask);

    if (shouldSkipTask(RnvTaskName.package, originTask)) return true;

    const bundleAssets = getConfigProp('bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    // NOTE: react-native v0.73 triggers packaging automatically so we skipping it unless we need to
    // package it explicitly for tasks where it is not triggered automatically

    const signingConfig = getConfigProp('signingConfig');

    if (originTask === RnvTaskName.eject || signingConfig !== 'Release') {
        //if bundleAssets === true AND signingConfig is not releaase RN will not trigger packaging
        return packageAndroid();
    }
    return true;
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn,
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
