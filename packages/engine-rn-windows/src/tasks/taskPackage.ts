import {
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    getConfigProp,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

const { packageBundleForWindows } = SDKWindows;

const taskPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.package, originTask);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    if (shouldSkipTask(c, RnvTaskName.package, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            return packageBundleForWindows(c);
        default:
            logErrorPlatform(c);
            return false;
    }
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskPackage,
    task: RnvTaskName.package,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;
