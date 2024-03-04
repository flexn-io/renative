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
import { buildWebNext } from '../sdk';

const taskBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.build, originTask);

    if (shouldSkipTask(c, RnvTaskName.build, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            if (parentTask === RnvTaskName.export) {
                // build task is not necessary when exporting. They do the same thing, only difference is a next.config.js config flag
                return true;
            }
            await buildWebNext(c);
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
    platforms: ['web', 'chromecast'],
};

export default Task;
