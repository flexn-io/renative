import { RnvContext, RnvTaskOptionPresets, logSuccess, RnvTask, RnvTaskFn } from '@rnv/core';

const task: RnvTaskFn = async (c: RnvContext) => {
    logSuccess(`Hello from Integration Starter single command! 
--my-opt: "${c.program.myOpt}"`);
};

const Task: RnvTask = {
    description: 'Prints hello message',
    fn: task,
    task: 'starter-single-command',
    options: RnvTaskOptionPresets.withBase([{ key: 'my-opt', description: 'Hello', value: 'value' }]),
    platforms: [],
};

export default Task;
