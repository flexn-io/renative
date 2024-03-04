import { RnvContext, logTask, RnvTaskOptionPresets, logSuccess, RnvTask } from '@rnv/core';

const taskStarterHello = async (_c: RnvContext) => {
    logTask('taskStarterHello');

    logSuccess('Hello from Integration Starter!');
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: taskStarterHello,
    task: 'starter hello',
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
