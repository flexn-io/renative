import { RnvTaskFn, logTask, PARAMS, executeOrSkipTask, shouldSkipTask, RnvTask, TaskKey } from '@rnv/core';

const taskDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TaskKey.export, TaskKey.deploy, originTask);

    if (shouldSkipTask(c, TaskKey.deploy, originTask)) return true;

    // Deploy simply triggers hook
    return true;
};

const Task: RnvTask = {
    description: 'Deploy the binary via selected deployment integeration or build hook',
    fn: taskDeploy,
    task: TaskKey.deploy,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['macos'],
};

export default Task;
