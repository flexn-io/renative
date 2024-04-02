import { RnvTaskName, createTask, logSuccess } from '@rnv/core';

export default createTask({
    description: 'Prints hello message',
    dependsOn: [RnvTaskName.package],
    beforeDependsOn: async () => {
        console.log('>>> beforeDependsOn called!!!');
    },
    fn: async ({ ctx }) => {
        logSuccess(`Hello from Integration Starter single command! 
        --my-opt value: ${ctx.program.opts().myOpt}`);
    },
    task: 'starter-single-command',
    platforms: ['ios', 'android'],
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
});
