import { logSuccess, RnvTask } from '@rnv/core';

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: async ({ ctx }) => {
        logSuccess(`Hello from Integration Starter! 
--my-opt: "${ctx.program.opts().myOpt}"`);
    },
    task: 'starter hello',
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
};

export default Task;
