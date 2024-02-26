import { RnvTaskFn, logTask, TASK_PACKAGE, TASK_CONFIGURE, PARAMS, executeOrSkipTask, RnvTask } from '@rnv/core';

export const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    // macOS does not require packaging
    return true;
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: TASK_PACKAGE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
