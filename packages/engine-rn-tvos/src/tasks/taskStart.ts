import {
    doResolve,
    logErrorPlatform,
    executeTask,
    shouldSkipTask,
    logTask,
    logError,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    PlatformKey,
    RnvTaskName,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const BUNDLER_PLATFORMS: Partial<Record<PlatformKey, PlatformKey>> = {};

BUNDLER_PLATFORMS['tvos'] = 'ios';
BUNDLER_PLATFORMS['androidtv'] = 'android';
BUNDLER_PLATFORMS['firetv'] = 'android';

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
    fn: taskStart,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
