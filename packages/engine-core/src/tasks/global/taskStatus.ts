import { PARAMS, RnvTask } from '@rnv/core';
import { TASK_STATUS } from './constants';

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
