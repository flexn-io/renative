import { RnvTask, RnvTaskName } from '@rnv/core';

const fn = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn,
    task: RnvTaskName.status,
    isGlobalScope: true,
};

export default Task;
