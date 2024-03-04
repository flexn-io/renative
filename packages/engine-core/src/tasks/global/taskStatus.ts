import { PARAMS, RnvTask, TaskKey } from '@rnv/core';

const taskStatus = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: taskStatus,
    task: TaskKey.status,
    options: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
