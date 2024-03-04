import { logTask, PARAMS, RnvTaskFn, executeOrSkipTask, shouldSkipTask, RnvTask, TaskKey } from '@rnv/core';

const taskDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TaskKey.export, TaskKey.deploy, originTask);

    if (shouldSkipTask(c, TaskKey.deploy, originTask)) return true;

    // Deploy simply trggets hook
    return true;
};

const Task: RnvTask = {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskDeploy,
    task: TaskKey.deploy,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
