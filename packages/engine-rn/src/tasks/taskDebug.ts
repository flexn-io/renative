import { logErrorPlatform, logTask, PARAMS, RnvTask, RnvTaskFn, TaskKey } from '@rnv/core';

const taskDebug: RnvTaskFn = async (c, parentTask) => {
    logTask('taskDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: taskDebug,
    task: TaskKey.debug,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
