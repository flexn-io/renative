import { Constants, Logger, PlatformManager, TaskManager } from 'rnv';
import { SDKElectron } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { MACOS, WINDOWS, LINUX, TASK_BUILD, TASK_EXPORT, PARAMS } = Constants;
const { exportElectron } = SDKElectron;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case MACOS:
        case WINDOWS:
        case LINUX:
            return exportElectron(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS, WINDOWS, LINUX],
};
