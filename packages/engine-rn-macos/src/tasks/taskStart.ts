import {
    doResolve,
    logErrorPlatform,
    executeTask,
    shouldSkipTask,
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    PlatformKey,
    RnvTaskName,
} from '@rnv/core';
import { startReactNative } from '@rnv/sdk-react-native';

const BUNDLER_PLATFORMS: Partial<Record<PlatformKey, PlatformKey>> = {};

BUNDLER_PLATFORMS['macos'] = 'macos';

const taskStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return Promise.reject('This platform does not support hosted mode');
    }
    // Disable reset for other commands (ie. cleaning platforms)
    c.runtime.disableReset = true;
    if (!parentTask) {
        await executeTask(RnvTaskName.configureSoft, RnvTaskName.start, originTask);
    }

    if (shouldSkipTask(RnvTaskName.start, originTask)) return true;

    switch (platform) {
        case 'macos': {
            return startReactNative({
                waitForBundler: !parentTask,
                customCliPath: `${doResolve('react-native')}/local-cli/cli.js`,
                metroConfigName: 'metro.config.rnm.js',
            });
        }
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn: taskStart,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['macos'],
};

export default Task;
