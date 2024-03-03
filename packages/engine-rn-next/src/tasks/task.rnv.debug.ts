import { RnvTaskFn, logErrorPlatform, logTask, PARAMS, RnvTask, TaskKey.debug } from '@rnv/core';

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
    task: TaskKey.debug,
    params: PARAMS.withBase(),
    platforms: ['web', 'chromecast'],
};

export default Task;
