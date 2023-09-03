import { Constants, Logger, PlatformManager, Exec, TaskManager } from 'rnv';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WEB, WEBTV, TIZEN, PARAMS, TASK_DEBUG } = Constants;
const { executeAsync } = Exec;
const { shouldSkipTask } = TaskManager;

export const taskRnvDebug = async (c, parentTask, originTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);

    if (shouldSkipTask(c, TASK_DEBUG, originTask)) return true;

    const { platform } = c;

    switch (platform) {
        case WEB:
        case WEBTV:
        case TIZEN:
            return executeAsync(c, 'npx weinre --boundHost -all-');
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Debug your app on target device or emulator',
    fn: taskRnvDebug,
    task: 'debug',
    params: PARAMS.withBase(),
    platforms: [WEB, WEBTV, TIZEN],
};
