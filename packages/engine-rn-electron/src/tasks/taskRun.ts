import {
    RnvTaskFn,
    logTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { runElectron } from '../sdk';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);

    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    return runElectron();
};

const Task: RnvTask = {
    description: 'Run your electron app on your machine',
    fn,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
