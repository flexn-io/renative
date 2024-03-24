import {
    RnvTaskFn,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { runWebNext } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRun', `parent:${parentTask}`);
    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);
    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    return runWebNext();
};

const Task: RnvTask = {
    description: 'Run your app in browser',
    fn,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
};

export default Task;
