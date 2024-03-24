import { logTask, RnvTaskFn, executeTask, RnvTask, RnvTaskName } from '@rnv/core';

const fn: RnvTaskFn = async (c, _, originTask) => {
    logTask('taskConfig');

    await executeTask(RnvTaskName.configureSoft, RnvTaskName.config, originTask);
    console.log(JSON.stringify(c.buildConfig, null, 2));
    return true;
};

const Task: RnvTask = {
    description: 'Display RNV config',
    fn,
    task: RnvTaskName.config,
};

export default Task;
