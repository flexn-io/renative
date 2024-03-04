import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { buildLightningProject } from '../sdks/sdk-lightning';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);
    const { platform } = c;
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.build, originTask);

    if (shouldSkipTask(c, RnvTaskName.build, originTask)) return true;

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
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['tizen', 'webos'],
};

export default Task;
