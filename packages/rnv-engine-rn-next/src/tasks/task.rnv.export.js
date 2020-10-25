import { TaskManager, Constants, Logger, PlatformManager, SDKNext } from 'rnv';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    WEB,
    CHROMECAST,
    TASK_BUILD, TASK_EXPORT,
    PARAMS
} = Constants;
const { exportWebNext } = SDKNext;
const { executeOrSkipTask } = TaskManager;

export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case WEB:
        case CHROMECAST:
            return exportWebNext(c);
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
        WEB,
        CHROMECAST,
    ],
};
