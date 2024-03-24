import {
    logTask,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
    doResolve,
} from '@rnv/core';
import { startReactNative } from '../metroRunner';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
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

    let customCliPath: string | undefined;
    let metroConfigName: string | undefined;
    const { reactNativePackageName, reactNativeMetroConfigName } = c.runtime?.runtimeExtraProps || {};
    if (reactNativePackageName) {
        customCliPath = `${doResolve(reactNativePackageName)}/local-cli/cli.js`;
    }
    if (metroConfigName) {
        metroConfigName = reactNativeMetroConfigName;
    }
    return startReactNative({ waitForBundler: !parentTask, customCliPath, metroConfigName });
};

const Task: RnvTask = {
    description: 'Starts react-native bundler',
    fn,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'firetv', 'macos'],
};

export default Task;
