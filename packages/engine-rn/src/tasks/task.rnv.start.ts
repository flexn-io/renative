import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    logError,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return logError('This platform does not support hosted mode', true);
    }
    // Disable reset for other commands (ie. cleaning platforms)
    c.runtime.disableReset = true;
    if (!parentTask) {
        await executeTask(c, TaskKey.configureSoft, TaskKey.start, originTask);
    }

    if (shouldSkipTask(c, TaskKey.start, originTask)) return true;

    switch (platform) {
        case 'ios':
        case 'macos':
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear': {
            return startReactNative(c, { waitForBundler: !parentTask });
        }
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TaskKey.start,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
