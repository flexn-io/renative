import {
    RnvTaskFn,
    logTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { buildElectron } from '../sdk';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskBuild', `parent:${parentTask}`);
    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.build, originTask);
    if (shouldSkipTask(RnvTaskName.build, originTask)) return true;

    return buildElectron();
};

const Task: RnvTask = {
    description: 'Build project binary',
    fn,
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
