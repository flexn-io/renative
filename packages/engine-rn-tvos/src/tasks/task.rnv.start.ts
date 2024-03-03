import {
    doResolve,
    logErrorPlatform,
    executeTask,
    shouldSkipTask,
    logTask,
    logError,
    TaskKey.start,
    TaskKey.configureSoft,
    PARAMS,
    RnvTaskFn,
    RnvTask,
    PlatformKey,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const BUNDLER_PLATFORMS: Partial<Record<PlatformKey, PlatformKey>> = {};

BUNDLER_PLATFORMS['tvos'] = 'ios';
BUNDLER_PLATFORMS['androidtv'] = 'android';
BUNDLER_PLATFORMS['firetv'] = 'android';

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
        case 'androidtv':
        case 'firetv':
        case 'tvos': {
            return startReactNative(c, {
                waitForBundler: !parentTask,
                customCliPath: `${doResolve('react-native-tvos')}/local-cli/cli.js`,
                metroConfigName: 'metro.config.js',
            });
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
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
