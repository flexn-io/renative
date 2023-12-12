import {
    doResolve,
    logErrorPlatform,
    executeTask,
    shouldSkipTask,
    logTask,
    logError,
    MACOS,
    TASK_START,
    TASK_CONFIGURE_SOFT,
    PARAMS,
    RnvTaskFn,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const BUNDLER_PLATFORMS: Record<string, string> = {};

BUNDLER_PLATFORMS[MACOS] = MACOS;

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
        case MACOS: {
            return startReactNative(c, {
                waitForBundler: !!parentTask,
                customCliPath: `${doResolve('react-native')}/local-cli/cli.js`,
                metroConfigName: 'metro.config.rnm.js',
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
    platforms: [MACOS],
};
