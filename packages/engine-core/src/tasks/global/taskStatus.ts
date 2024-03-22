import { RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';

const taskStatus = async () => Promise.resolve();

const Task: RnvTask = {
    description: 'Show current info about the project',
    fn: taskStatus,
    task: RnvTaskName.status,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true,
};

export default Task;
