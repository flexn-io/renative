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
import { packageBundleForXcode } from '../runner';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.package, originTask);

    if (shouldSkipTask(RnvTaskName.package, originTask)) return true;

    const bundleAssets = getConfigProp('bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    return packageBundleForXcode();
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn,
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: ['ios', 'tvos', 'macos'],
};

export default Task;
