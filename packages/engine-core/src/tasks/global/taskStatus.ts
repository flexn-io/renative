import { RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: async () => {
        return true;
    },
    task: RnvTaskName.status,
    isGlobalScope: true,
};

export default Task;
