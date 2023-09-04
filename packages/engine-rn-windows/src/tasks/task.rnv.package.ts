import { TaskManager, Constants, Logger, PlatformManager, Common, RnvTaskFn } from 'rnv';
import { SDKWindows } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WINDOWS, XBOX, TASK_PACKAGE, TASK_CONFIGURE, PARAMS } = Constants;
const { getConfigProp } = Common;
const { packageBundleForWindows } = SDKWindows;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

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
        case XBOX:
        case WINDOWS:
            return packageBundleForWindows(c);
        default:
            logErrorPlatform(c);
            return false;
    }
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: 'package',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};
