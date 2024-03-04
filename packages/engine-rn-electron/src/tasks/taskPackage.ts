import { RnvTaskFn, logTask, PARAMS, executeOrSkipTask, RnvTask, TaskKey } from '@rnv/core';

const taskPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.package, originTask);

    // macOS does not require packaging
    return true;
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskPackage,
    task: TaskKey.package,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos', 'windows', 'linux'],
};

export default Task;
