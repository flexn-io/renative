import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TASK_BUILD,
    TASK_PACKAGE,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
} from '@rnv/core';
import { buildWeb } from '@rnv/sdk-webpack';
import { buildTizenProject } from '@rnv/sdk-tizen';
import { buildWebOSProject } from '@rnv/sdk-webos';
import { buildKaiOSProject } from '@rnv/sdk-kaios';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);

    const { platform } = c;

    // Build aways bundles assets
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'webtv':
        case 'chromecast':
            await buildWeb(c);
            return;
        case 'kaios':
            await buildKaiOSProject(c);
            return;
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            await buildTizenProject(c);
            return;
        case 'webos':
            await buildWebOSProject(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
