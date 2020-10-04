import { chalk, logToSummary, logTask } from '../../core/systemManager/logger';
import { PARAMS } from '../../core/constants';
import { getRegisteredEngines } from '../../core/engineManager';

export const taskRnvHelp = (c) => {
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
    let cmdsString = '';
    const tasksObj = {};
    const engines = getRegisteredEngines(c);

    engines.forEach((engine) => {
        const tasks = engine.getTasks();
        tasks.forEach((t) => {
            tasksObj[t.task] = true;
        });
    });
    cmdsString = Object.keys(tasksObj).join(', ');


    logToSummary(`
${chalk().bold.white('COMMANDS:')}

${cmdsString}

${chalk().bold.white('OPTIONS:')}

${optsString}
`);
};

export default {
    description: 'Display generic help',
    fn: taskRnvHelp,
    task: 'help',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
