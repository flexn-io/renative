import { RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Display RNV config',
    dependsOn: [RnvTaskName.configureSoft],
    fn: async ({ ctx }) => {
        console.log(JSON.stringify(ctx.buildConfig, null, 2));
        return true;
    },
    task: RnvTaskName.config,
};

export default Task;
