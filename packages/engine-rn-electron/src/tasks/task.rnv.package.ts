import {
    RnvTaskFn,
    logTask,
    MACOS,
    WINDOWS,
    LINUX,
    TASK_PACKAGE,
    TASK_CONFIGURE,
    PARAMS,
    executeOrSkipTask,
} from '@rnv/core';

export const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    // macOS does not require packaging
    return true;
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: TASK_PACKAGE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS, WINDOWS, LINUX],
};
