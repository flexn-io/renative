import {
    RnvTaskFn,
    logTask,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    SUPPORTED_PLATFORMS,
} from '@rnv/core';

const taskDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, RnvTaskName.export, RnvTaskName.deploy, originTask);

    if (shouldSkipTask(RnvTaskName.deploy, originTask)) return true;

    // Deploy simply trggets hook
    return true;
};

const Task: RnvTask = {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskDeploy,
    task: RnvTaskName.deploy,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: [...SUPPORTED_PLATFORMS],
};

export default Task;
