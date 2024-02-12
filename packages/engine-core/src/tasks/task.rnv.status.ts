import { PARAMS, RnvTask } from '@rnv/core';

export const taskRnvStatus = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: taskRnvStatus,
    task: 'status',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
