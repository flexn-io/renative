import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeAsync,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskDebug: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDebug', `parent:${parentTask}`);

    if (shouldSkipTask(c, TaskKey.debug, originTask)) return true;

    const { platform } = c;

    switch (platform) {
        case 'web':
        case 'webtv':
        case 'tizen':
            return executeAsync(c, 'npx weinre --boundHost -all-');
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: taskDebug,
    task: TaskKey.debug,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['web', 'webtv', 'tizen'],
};

export default Task;
