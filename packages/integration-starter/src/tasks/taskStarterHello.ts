import { createTask, logSuccess } from '@rnv/core';

export default createTask({
    description: 'Prints hello message',
    fn: async ({ ctx }) => {
        //TODO: switch to typed options once Context generics are supported
        const opts: any = ctx.program.opts();
        logSuccess(`Hello from Integration Starter! 
--my-opt: "${opts.myOpt}"`);
    },
    task: 'starter hello',
    options: [{ key: 'my-opt', description: 'Hello', isValueType: true }],
});
