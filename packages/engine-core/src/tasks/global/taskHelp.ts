import {
    chalk,
    logToSummary,
    getRegisteredEngines,
    createTask,
    RnvTaskName,
    generateStringFromTaskOption,
    RnvTaskOptions,
} from '@rnv/core';

/**
 * CLI command `npx rnv help` triggers this task, which displays a generic help message for available commands and options in the project.
 * The displayed information includes:
 * - **COMMANDS**: A list of all available commands, including those registered by each engine.
 * - **OPTIONS**: A list of available options with descriptions for each task.
 * Available globally
 * @returns {Promise<void>} Resolves once the help message has been displayed.
 */
export default createTask({
    description: 'Display generic help',
    fn: async () => {
        // PARAMS
        let optsString = '';

        Object.values(RnvTaskOptions).forEach((param) => {
            optsString += chalk().grey(`${generateStringFromTaskOption(param)}, ${param.description}\n`);
        });

        // TASKS
        const commands: Array<string> = [];
        const engines = getRegisteredEngines();

        engines.forEach((engine) => {
            Object.values(engine.tasks).forEach(({ task }) => {
                commands.push(task);
            });
        });
        const cmdsString = commands.join(', ');

        logToSummary(`
${chalk().bold.white('COMMANDS:')}

${cmdsString}

${chalk().bold.white('OPTIONS:')}

${optsString}
`);
    },
    task: RnvTaskName.help,
    isGlobalScope: true,
    isPriorityOrder: true,
});
