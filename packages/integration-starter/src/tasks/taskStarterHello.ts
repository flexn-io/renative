import { RnvContext, logTask, PARAMS, logSuccess, RnvTask } from '@rnv/core';

const taskStarterHello = async (_c: RnvContext) => {
    logTask('taskStarterHello');

    logSuccess('Hello from Integration Starter!');
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: taskStarterHello,
    task: 'starter hello',
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
