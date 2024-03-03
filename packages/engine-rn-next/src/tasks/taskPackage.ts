import { RnvTaskFn, logTask, PARAMS, executeOrSkipTask, RnvTask, TaskKey } from '@rnv/core';

const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.package, originTask);

    return true;
};

const Task: RnvTask = {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: TaskKey.package,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'chromecast'],
};

export default Task;
