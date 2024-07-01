import {
    chalk,
    logToSummary,
    getRegisteredEngines,
    createTask,
    RnvTaskName,
    generateStringFromTaskOption,
    RnvTaskOptions,
} from '@rnv/core';

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
