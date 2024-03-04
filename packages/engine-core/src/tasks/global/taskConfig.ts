import { logTask, PARAMS, RnvTaskFn, executeTask, SUPPORTED_PLATFORMS, RnvTask, TaskKey } from '@rnv/core';

const taskConfig: RnvTaskFn = async (c, _, originTask) => {
    logTask('taskConfig');

    await executeTask(c, TaskKey.configureSoft, TaskKey.config, originTask);

    console.log(JSON.stringify(c.buildConfig, null, 2));

    return true;
};

const Task: RnvTask = {
    description: 'Display RNV config',
    fn: taskConfig,
    task: TaskKey.config,
    options: PARAMS.withBase(),
    platforms: [...SUPPORTED_PLATFORMS],
};

export default Task;
