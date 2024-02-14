import { RnvTaskFn, logErrorPlatform, logTask, WEB, CHROMECAST, PARAMS, RnvTask, TASK_DEBUG } from '@rnv/core';

export const taskRnvDebug: RnvTaskFn = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: taskRnvDebug,
    task: TASK_DEBUG,
    params: PARAMS.withBase(),
    platforms: [WEB, CHROMECAST],
};

export default Task;
