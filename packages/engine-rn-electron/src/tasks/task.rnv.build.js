import { Constants, Logger, PlatformManager, TaskManager } from 'rnv';
import { SDKElectron } from '../sdks';

const { logTask } = Logger;
const { MACOS, WINDOWS, LINUX, TASK_BUILD, TASK_PACKAGE, PARAMS } = Constants;
const { logErrorPlatform } = PlatformManager;
const { buildElectron } = SDKElectron;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case MACOS:
        case WINDOWS:
        case LINUX:
            await buildElectron(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS, WINDOWS, LINUX],
};
