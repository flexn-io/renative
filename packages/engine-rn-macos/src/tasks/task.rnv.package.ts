import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TaskKey.package,
    TaskKey.configure,
    PARAMS,
    getConfigProp,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { packageBundleForXcode } from '@rnv/sdk-apple';

export const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.package, originTask);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');

    if (!bundleAssets) {
        return true;
    }

    if (shouldSkipTask(c, TaskKey.package, originTask)) return true;

    switch (platform) {
        case 'macos':
            return packageBundleForXcode(c);
        default:
            logErrorPlatform(c);
            return false;
    }
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: TaskKey.package,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos'],
};

export default Task;
