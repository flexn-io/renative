import {
    RnvTaskFn,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { exportXcodeProject } from '../runner';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskExport', `parent:${parentTask}`);

    await executeOrSkipTask(RnvTaskName.build, RnvTaskName.export, originTask);

    if (shouldSkipTask(RnvTaskName.export, originTask)) return true;

    return exportXcodeProject();
};

const Task: RnvTask = {
    description: 'Export the app into deployable binary',
    fn,
    task: RnvTaskName.export,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: ['ios', 'tvos', 'macos'],
};

export default Task;
