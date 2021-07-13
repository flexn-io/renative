import { Constants, Logger, PlatformManager, TaskManager } from 'rnv';
import { SDKWindows } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    WINDOWS,
    TASK_BUILD,
    TASK_EXPORT,
    PARAMS
} = Constants;
// TODO Implement exportWindowsApp
const { ruWindowsProject } = SDKWindows;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case WINDOWS:
            return ruWindowsProject(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WINDOWS
    ],
};
