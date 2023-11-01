import { RnvContext, logTask, PARAMS, logSuccess } from '@rnv/core';

export const taskRnvStarterHello = async (_c: RnvContext) => {
    logTask('taskRnvStarterHello');

    logSuccess('Hello from Integration Starter!');
};

export default {
    description: 'Prints hello message',
    fn: taskRnvStarterHello,
    task: 'starter hello',
    params: PARAMS.withBase(),
    platforms: [],
};
