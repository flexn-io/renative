import { RnvTaskFn, logErrorPlatform, logTask, PARAMS, RnvTask, TaskKey } from '@rnv/core';

export const taskRnvDebug: RnvTaskFn = async (c) => {
    logTask('taskRnvDebug');
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
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
