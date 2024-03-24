import {
    RnvTaskFn,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { buildWebNext } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);
    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.build, originTask);
    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;

    if (parentTask === RnvTaskName.export) {
        // build task is not necessary when exporting. They do the same thing, only difference is a next.config.js config flag
        return true;
    }
    await buildWebNext();
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
