import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { buildWeb } from '@rnv/sdk-webpack';
import { buildTizenProject } from '@rnv/sdk-tizen';
import { buildWebOSProject } from '@rnv/sdk-webos';
import { buildKaiOSProject } from '@rnv/sdk-kaios';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);

    const { platform } = c;

    // Build aways bundles assets
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.build, originTask);

    if (shouldSkipTask(c, RnvTaskName.build, originTask)) return true;

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
    fn: taskBuild,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
