import {
    chalk,
    logToSummary,
    logTask,
    RnvTaskOptionPresets,
    getRegisteredEngines,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskHelp: RnvTaskFn = async (c) => {
    logTask('taskHelp');

    // PARAMS
    let optsString = '';

    RnvTaskOptionPresets.withAll().forEach((param) => {
        let cmd = '';
        if (param.shortcut) {
            cmd += `-${param.shortcut}, `;
        }
        cmd += `--${param.key}`;
        if (param.value) {
            if (param.isRequired) {
                cmd += ` <${param.value}>`;
            } else {
                cmd += ` [${param.value}]`;
            }
        }
        optsString += chalk().grey(`${cmd}, ${param.description}\n`);
    });

    // TASKS
    const commands: Array<string> = [];
    const engines = getRegisteredEngines(c);

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
};

const Task: RnvTask = {
    description: 'Display generic help',
    fn: taskHelp,
    task: RnvTaskName.help,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPriorityOrder: true,
};

export default Task;
