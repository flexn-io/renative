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

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.build, originTask);

    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;

    switch (platform) {
        case 'tizen':
        case 'webos':
            await buildLightningProject();
            return;
        default:
            logErrorPlatform();
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
