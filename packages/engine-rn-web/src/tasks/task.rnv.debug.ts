import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    WEB,
    WEBTV,
    TIZEN,
    PARAMS,
    TASK_DEBUG,
    executeAsync,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';

export const taskRnvDebug: RnvTaskFn = async (c, parentTask, originTask) => {
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

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: taskRnvDebug,
    task: TASK_DEBUG,
    params: PARAMS.withBase(),
    platforms: [WEB, WEBTV, TIZEN],
};

export default Task;
