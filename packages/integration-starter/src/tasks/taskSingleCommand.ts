import { logSuccess, RnvTask } from '@rnv/core';

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: async ({ ctx }) => {
        logSuccess(`Hello from Integration Starter single command! 
        --my-opt: "${ctx.program.opts().myOpt}"`);
    },
    task: 'starter-single-command',
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
};

export default Task;
