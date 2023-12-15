import {
    logErrorPlatform,
    logTask,
    WINDOWS,
    XBOX,
    PARAMS,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    doResolve,
    TASK_START,
    TASK_CONFIGURE_SOFT,
    logError,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const BUNDLER_PLATFORMS: Record<string, string> = {};

BUNDLER_PLATFORMS[WINDOWS] = WINDOWS;
BUNDLER_PLATFORMS[XBOX] = WINDOWS;

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
        await executeTask(c, TASK_CONFIGURE_SOFT, TASK_START, originTask);
    }

    if (shouldSkipTask(c, TASK_START, originTask)) return true;

    switch (platform) {
        case XBOX:
        case WINDOWS: {
            return startReactNative(c, {
                waitForBundler: !!parentTask,
                customCliPath: `${doResolve('react-native')}/local-cli/cli.js`,
                metroConfigName: 'metro.config.js',
            });
        }
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TASK_START,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};
