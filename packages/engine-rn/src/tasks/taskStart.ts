import {
    logErrorPlatform,
    logTask,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    logError,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const taskStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return logError('This platform does not support hosted mode', true);
    }
    // Disable reset for other commands (ie. cleaning platforms)
    c.runtime.disableReset = true;
    if (!parentTask) {
        await executeTask(c, RnvTaskName.configureSoft, RnvTaskName.start, originTask);
    }

    if (shouldSkipTask(c, RnvTaskName.start, originTask)) return true;

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
    fn: taskStart,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
