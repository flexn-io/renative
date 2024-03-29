import { chalk, logToSummary, logTask, PARAMS, getRegisteredEngines, RnvTaskFn, RnvTask, TASK_HELP } from '@rnv/core';

export const taskRnvHelp: RnvTaskFn = async (c) => {
    logTask('taskRnvHelp');

    // PARAMS
    let optsString = '';

    PARAMS.withAll().forEach((param) => {
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
${chalk().bold.white('COMMANDS:')}

${cmdsString}

${chalk().bold.white('OPTIONS:')}

${optsString}
`);
};

const Task: RnvTask = {
    description: 'Display generic help',
    fn: taskRnvHelp,
    task: TASK_HELP,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
    isPriorityOrder: true,
};

export default Task;
