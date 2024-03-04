import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { buildLightningProject } from '../sdks/sdk-lightning';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);
    const { platform } = c;
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.build, originTask);

    if (shouldSkipTask(c, TaskKey.build, originTask)) return true;

    switch (platform) {
        case 'tizen':
        case 'webos':
            await buildLightningProject(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn: taskBuild,
    task: TaskKey.build,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['tizen', 'webos'],
};

export default Task;
