import { RnvTaskName, createTask, logSuccess } from '@rnv/core';

export default createTask({
    description: 'Prints hello message',
    dependsOn: [RnvTaskName.package],
    fn: async ({ ctx }) => {
        logSuccess(`Hello from Integration Starter! 
--my-opt value: ${ctx.program.opts().myOpt}`);
    },
    task: 'starter hello',
    platforms: ['ios'],
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
});
