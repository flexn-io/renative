import {
    logToSummary,
    logTask,
    generateOptions,
    buildHooks,
    executeTask,
    PARAMS,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskHooksList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskHooksList');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.hooksList, originTask);
    await buildHooks(c);

    if (c.buildHooks) {
        const hookOpts = generateOptions(c.buildHooks);
        let hooksAsString = `\n${'Hooks:'}\n${hookOpts.asString}`;

        if (c.buildPipes) {
            const pipeOpts = generateOptions(c.buildPipes);
            hooksAsString += `\n${'Pipes:'}\n${pipeOpts.asString}`;
        }
        logToSummary(hooksAsString);
        return;
    }
    return Promise.reject('Your buildHooks object is empty!');
};

const Task: RnvTask = {
    description: 'Get list of all available hooks',
    fn: taskHooksList,
    task: TaskKey.hooksList,
    options: PARAMS.withBase(),
    platforms: [],
    forceBuildHookRebuild: true,
};

export default Task;
