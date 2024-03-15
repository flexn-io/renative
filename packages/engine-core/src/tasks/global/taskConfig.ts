import {
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeTask,
    SUPPORTED_PLATFORMS,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskConfig: RnvTaskFn = async (c, _, originTask) => {
    logTask('taskConfig');

    await executeTask(RnvTaskName.configureSoft, RnvTaskName.config, originTask);

    console.log(JSON.stringify(c.buildConfig, null, 2));

    return true;
};

const Task: RnvTask = {
    description: 'Display RNV config',
    fn: taskConfig,
    task: RnvTaskName.config,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [...SUPPORTED_PLATFORMS],
};

export default Task;
