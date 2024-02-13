import { PARAMS, RnvTask, TASK_STATUS } from '@rnv/core';

export const taskRnvStatus = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: taskRnvStatus,
    task: TASK_STATUS,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
