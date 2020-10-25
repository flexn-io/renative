import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { SDKElectron } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    MACOS,
    WINDOWS,
    TASK_BUILD, TASK_EXPORT,
    PARAMS
} = Constants;
const {
    exportElectron
} = SDKElectron;
const { executeOrSkipTask } = TaskManager;


export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return exportElectron(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: 'export',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
