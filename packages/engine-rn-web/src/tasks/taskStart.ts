import { runWebpackServer } from '@rnv/sdk-webpack';
import {
    RnvTaskFn,
    getConfigProp,
    logErrorPlatform,
    logTask,
    logError,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { REMOTE_DEBUGGER_ENABLED_PLATFORMS, openBrowser, waitForHost } from '@rnv/sdk-utils';

const taskStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    if (!platform) return;

    logTask('taskStart', `parent:${parentTask} port:${port} hosted:${!!hosted}`);

    if (!parentTask) {
        await executeTask(RnvTaskName.configure, RnvTaskName.start, originTask);
    }

    if (shouldSkipTask(RnvTaskName.start, originTask)) return true;

    if (hosted) {
        waitForHost('')
            .then(() => openBrowser(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

    switch (platform) {
        case 'web':
        case 'webtv':
        case 'tizen':
        case 'webos':
        case 'tizenmobile':
        case 'tizenwatch':
            // c.runtime.keepSessionActive = true;
            return runWebpackServer(isWeinreEnabled);
        default:
            if (hosted) {
                return logError('This platform does not support hosted mode', true);
            }
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn: taskStart,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
