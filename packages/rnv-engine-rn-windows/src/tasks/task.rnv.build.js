import {
    Constants, Logger,
    //  PlatformManager,
    TaskManager
} from 'rnv';
import { WINDOWS } from 'rnv/dist/core/constants';
import { SDKWindows } from '../sdks';

// const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    // WINDOWS,
    TASK_BUILD, TASK_PACKAGE,
    PARAMS
} = Constants;

const { buildWindowsProject } = SDKWindows;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);

    const { platform } = c;

    // Build aways bundles assets
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    await buildWindowsProject(c, platform);
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WINDOWS
    ],
};
