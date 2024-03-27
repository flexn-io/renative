import {
    chalk,
    logToSummary,
    RnvTaskOptionPresets,
    getRegisteredEngines,
    RnvTask,
    RnvTaskName,
    generateStringFromTaskOption,
} from '@rnv/core';

const Task: RnvTask = {
    description: 'Display generic help',
    fn: async () => {
        // PARAMS
        let optsString = '';

        RnvTaskOptionPresets.withAll().forEach((param) => {
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
${chalk().bold('COMMANDS:')}

${cmdsString}

${chalk().bold('OPTIONS:')}

${optsString}
`);
    },
    task: RnvTaskName.help,
    isGlobalScope: true,
    isPriorityOrder: true,
};

export default Task;
