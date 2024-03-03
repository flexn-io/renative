import { RnvContext, logTask, PARAMS, logSuccess, RnvTask } from '@rnv/core';

export const taskRnvStarterHello = async (_c: RnvContext) => {
    logTask('taskRnvStarterHello');

    logSuccess('Hello from Integration Starter!');
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: taskRnvStarterHello,
    task: 'starter hello',
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
