import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeAsync,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskDebug: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDebug', `parent:${parentTask}`);

    if (shouldSkipTask(RnvTaskName.debug, originTask)) return true;

    const { platform } = c;

    switch (platform) {
        case 'web':
        case 'webtv':
        case 'tizen':
            return executeAsync('npx weinre --boundHost -all-');
        default:
            logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: taskDebug,
    task: RnvTaskName.debug,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['web', 'webtv', 'tizen'],
};

export default Task;
