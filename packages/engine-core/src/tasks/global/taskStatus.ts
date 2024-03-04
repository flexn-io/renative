import { RnvTaskOptionPresets, RnvTask, TaskKey } from '@rnv/core';

const taskStatus = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: taskStatus,
    task: TaskKey.status,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
