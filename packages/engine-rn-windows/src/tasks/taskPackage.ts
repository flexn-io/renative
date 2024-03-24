import {
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    getConfigProp,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { SdkPlatforms } from '../sdk/constants';
import { packageBundleForWindows } from '../sdk';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);
    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.package, originTask);

    const bundleAssets = getConfigProp('bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    if (shouldSkipTask(RnvTaskName.package, originTask)) return true;
    return packageBundleForWindows(c);
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn,
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
