import { createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Show current info about the project',
    fn: async () => {
        return true;
    },
    task: RnvTaskName.status,
    isGlobalScope: true,
});
