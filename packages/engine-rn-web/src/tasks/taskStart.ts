import { runWebpackServer } from '@rnv/sdk-webpack';
import {
    RnvTaskFn,
    getConfigProp,
    logErrorPlatform,
    logTask,
    logError,
    PARAMS,
    executeTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { REMOTE_DEBUGGER_ENABLED_PLATFORMS, openBrowser, waitForHost } from '@rnv/sdk-utils';

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    if (!platform) return;

    logTask('taskRnvStart', `parent:${parentTask} port:${port} hosted:${!!hosted}`);

    if (!parentTask) {
        await executeTask(c, TaskKey.configure, TaskKey.start, originTask);
    }

    if (shouldSkipTask(c, TaskKey.start, originTask)) return true;

    if (hosted) {
        waitForHost(c, '')
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
            return runWebpackServer(c, isWeinreEnabled);
        default:
            if (hosted) {
                return logError('This platform does not support hosted mode', true);
            }
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TaskKey.start,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;