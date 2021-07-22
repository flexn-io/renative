import { Constants, Logger, TaskManager } from 'rnv';
import { SDKWindows } from '../sdks';

const { logTask } = Logger;
const {
    WINDOWS,
    TASK_BUILD,
    TASK_PACKAGE,
    PARAMS
} = Constants;
const { ruWindowsProject } = SDKWindows;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);

    // Build aways bundles assets
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    await ruWindowsProject(c, { release: true, launch: false, deploy: false });
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
