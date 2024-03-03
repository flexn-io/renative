import { RnvTaskFn, logTask, PARAMS, executeOrSkipTask, shouldSkipTask, RnvTask, TaskKey } from '@rnv/core';

const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TaskKey.export, TaskKey.deploy, originTask);

    if (shouldSkipTask(c, TaskKey.deploy, originTask)) return true;

    // Deploy simply trggets hook
    return true;
};

const Task: RnvTask = {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TaskKey.deploy,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
