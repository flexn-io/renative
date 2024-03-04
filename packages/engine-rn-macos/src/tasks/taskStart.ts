import {
    doResolve,
    logErrorPlatform,
    executeTask,
    shouldSkipTask,
    logTask,
    logError,
    PARAMS,
    RnvTaskFn,
    RnvTask,
    PlatformKey,
    TaskKey,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const BUNDLER_PLATFORMS: Partial<Record<PlatformKey, PlatformKey>> = {};

BUNDLER_PLATFORMS['macos'] = 'macos';

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
        await executeTask(c, TaskKey.configureSoft, TaskKey.start, originTask);
    }

    if (shouldSkipTask(c, TaskKey.start, originTask)) return true;

    switch (platform) {
        case 'macos': {
            return startReactNative(c, {
                waitForBundler: !parentTask,
                customCliPath: `${doResolve('react-native')}/local-cli/cli.js`,
                metroConfigName: 'metro.config.rnm.js',
            });
        }
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn: taskStart,
    task: TaskKey.start,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos'],
};

export default Task;
