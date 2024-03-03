import { logTask, PARAMS, RnvTaskFn, executeTask, SUPPORTED_PLATFORMS, RnvTask, TaskKey } from '@rnv/core';

export const taskRnvConfig: RnvTaskFn = async (c, _, originTask) => {
    logTask('taskRnvConfig');

    await executeTask(c, TaskKey.configureSoft, TaskKey.config, originTask);

    console.log(JSON.stringify(c.buildConfig, null, 2));

    return true;
};

const Task: RnvTask = {
    description: 'Display RNV config',
    fn: taskRnvConfig,
    task: TaskKey.config,
    params: PARAMS.withBase(),
    platforms: [...SUPPORTED_PLATFORMS],
};

export default Task;
