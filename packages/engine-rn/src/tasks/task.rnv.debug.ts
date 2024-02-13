import { logErrorPlatform, logTask, PARAMS, RnvTask, RnvTaskFn } from '@rnv/core';

export const taskRnvDebug: RnvTaskFn = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: taskRnvDebug,
    task: 'debug',
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
