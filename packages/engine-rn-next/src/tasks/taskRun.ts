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
import { runWebNext } from '../sdk';

const taskRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    logTask('taskRun', `parent:${parentTask}`);

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.run, originTask);

    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'chromecast':
            c.runtime.shouldOpenBrowser = true;
            return runWebNext();
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Run your app in browser',
    fn: taskRun,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun())),
    platforms: ['web', 'chromecast'],
};

export default Task;
