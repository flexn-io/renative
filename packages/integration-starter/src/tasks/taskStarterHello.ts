import { RnvTaskName, createTask, logSuccess } from '@rnv/core';

export default createTask({
    description: 'Prints hello message',
    dependsOn: [RnvTaskName.package],
    fn: async ({ ctx }) => {
        //TODO: switch to typed options once Context generics are supported
        const opts: any = ctx.program.opts();
        logSuccess(`Hello from Integration Starter! 
--my-opt value: ${opts.myOpt}`);
    },
    task: 'starter hello',
    platforms: ['ios'],
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
});
