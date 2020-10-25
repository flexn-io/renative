import { logTask, logInitTask, logExitTask, chalk, logRaw } from '../systemManager/logger';
import Analytics from '../systemManager/analytics';
import { executePipe } from '../projectManager/buildHooks';
import { pressAnyKeyToContinue } from '../../cli/prompt';
import { checkIfProjectAndNodeModulesExists } from '../systemManager/npmUtils';
import { getEngineRunner, getEngineTask } from '../engineManager';
import { TASK_CONFIGURE_SOFT } from '../constants';


let executedTasks = {};

export const registerCustomTask = async () => {

};

export const initializeTask = async (c, task) => {
    logTask('initializeTask', task);
    c.runtime.task = task;
    executedTasks = {};

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });

    await executeTask(c, task, null, task, true);
    return true;
};


const _executePipe = async (c, task, phase) => executePipe(c, `${task.split(' ').join(':')}:${phase}`);

const TASK_LIMIT = 20;

export const executeTask = async (c, task, parentTask, originTask, isFirstTask) => {
    const pt = parentTask ? `=> [${parentTask}] ` : '';
    c._currentTask = task;
    logInitTask(`${pt}=> [${chalk().bold.rgb(170, 106, 170)(task)}]`);

    if (!executedTasks[task]) executedTasks[task] = 0;
    if (executedTasks[task] > TASK_LIMIT) {
        return Promise.reject(`You reached maximum amount of executions per one task (${TASK_LIMIT}) task: ${task}.
This is to warn you ended up in task loop.
(${task} calls same or another task which calls ${task} again)
but issue migh not be necessarily with this task

To avoid that test your task code against parentTask and avoid executing same task X from within task X`);
    }
    await getEngineRunner(c, task).executeTask(c, task, parentTask, originTask, isFirstTask);
    executedTasks[task]++;

    c._currentTask = parentTask;
    const prt = parentTask ? `<= [${chalk().rgb(170, 106, 170)(parentTask)}] ` : '';
    logExitTask(`${prt}<= ${task}`);
};

export const executeOrSkipTask = async (c, task, parentTask, originTask) => {
    if (!c.program.only) {
        return executeTask(c, task, parentTask, originTask);
    }

    return executeTask(c, TASK_CONFIGURE_SOFT, parentTask, originTask);
};

export const executeEngineTask = async (c, task, parentTask, originTask, tasks, isFirstTask) => {
    const needsHelp = Object.prototype.hasOwnProperty.call(c.program, 'help');

    const t = getEngineTask(task, tasks);

    if (needsHelp && !parentTask) {
        logRaw(`
=======================================================
INTERACTIVE HELP FOR TASK: ${chalk().green(t.task)}

Description: ${t.description}

Options:

${t.params.map((v) => {
        const option = v.shortcut ? `\`-${v.shortcut}\`, ` : '';
        return `${option}\`--${v.key}\` - ${v.description}`;
    }).join('\n')}

  `);
        if (t.fnHelp) {
            await t.fnHelp(c, parentTask, originTask);
        }

        await pressAnyKeyToContinue();
        logRaw(`
=======================================================`);
    }

    if (!t.isGlobalScope && isFirstTask) {
        if (c.files.project.package) {
            // This has to happen in order for hooks to be able to run
            await checkIfProjectAndNodeModulesExists(c);
        }
    }
    const inOnlyMode = c.program.only;
    const doPipe = !t.isGlobalScope && (!inOnlyMode || (inOnlyMode && isFirstTask));
    if (doPipe) await _executePipe(c, task, 'before');
    await t.fn(c, parentTask, originTask);
    if (doPipe) await _executePipe(c, task, 'after');
};
