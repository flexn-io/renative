import { RnvTaskFn, logTask, executeAsync, shouldSkipTask, RnvTask, RnvTaskName } from '@rnv/core';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDebug', `parent:${parentTask}`);

    if (shouldSkipTask(RnvTaskName.debug, originTask)) return true;

    return executeAsync('npx weinre --boundHost -all-');
};

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn,
    task: RnvTaskName.debug,
    platforms: ['web', 'webtv', 'tizen'],
};

export default Task;
