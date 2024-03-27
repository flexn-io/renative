import { chalk, logToSummary, generatePlatformChoices, RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'List all available platforms',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        const opts = generatePlatformChoices().map((v, i) => ` [${chalk().bold(i + 1)}]> ${v.name}`);
        logToSummary(`Platforms:\n\n${opts.join('\n')}`);
        return true;
    },
    task: RnvTaskName.platformList,
};

export default Task;
