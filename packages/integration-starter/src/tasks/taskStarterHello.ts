import { RnvContext, RnvTaskOptionPresets, logSuccess, RnvTask, RnvTaskFn } from '@rnv/core';

const taskStarterHello: RnvTaskFn = async (c: RnvContext) => {
    logSuccess(`Hello from Integration Starter! 
--my-opt: "${c.program.myOpt}"`);
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: taskStarterHello,
    task: 'starter hello',
    options: RnvTaskOptionPresets.withBase([{ key: 'my-opt', description: 'Hello', value: 'value' }]),
    platforms: [],
};

export default Task;
