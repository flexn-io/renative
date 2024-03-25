import { RnvContext, logSuccess, RnvTask, RnvTaskFn } from '@rnv/core';

const fn: RnvTaskFn = async (c: RnvContext<any, 'myOpt'>) => {
    logSuccess(`Hello from Integration Starter! 
--my-opt: "${c.program.opts().myOpt}"`);
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn,
    task: 'starter hello',
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
};

export default Task;
