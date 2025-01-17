import { chalk, logToSummary, generatePlatformChoices, createTask, RnvTaskName } from '@rnv/core';

/**
 * CLI command `npx rnv platform list` triggers this task, which displays a list of all available platforms.
 */
export default createTask({
    description: 'List all available platforms',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        const opts = generatePlatformChoices().map((v, i) => ` [${chalk().bold.white(i + 1)}]> ${v.name}`);
        logToSummary(`Platforms:\n\n${opts.join('\n')}`);
        return true;
    },
    task: RnvTaskName.platformList,
});
