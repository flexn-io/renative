import { PARAMS, RnvTask, TaskKey } from '@rnv/core';

const taskRnvStatus = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: taskRnvStatus,
    task: TaskKey.status,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
