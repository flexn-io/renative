import { RnvContext, RnvTaskOptionPresets, logSuccess, RnvTask, RnvTaskFn } from '@rnv/core';

const task: RnvTaskFn = async (c: RnvContext<any, 'myOpt'>) => {
    logSuccess(`Hello from Integration Starter! 
--my-opt: "${c.program.myOpt}"`);
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: task,
    task: 'starter hello',
    options: RnvTaskOptionPresets.withBase([{ key: 'my-opt', description: 'Hello', isValueType: true }]),
    platforms: null,
};

export default Task;
