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
import { packageBundleForXcode } from '@rnv/sdk-apple';

const taskPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.package, originTask);

    const bundleAssets = getConfigProp('bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    if (shouldSkipTask(RnvTaskName.package, originTask)) return true;

    switch (platform) {
        case 'macos':
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
    platforms: ['macos'],
};

export default Task;
