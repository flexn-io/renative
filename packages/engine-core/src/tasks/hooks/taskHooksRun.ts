import {
    logTask,
    logInfo,
    buildHooks,
    executeTask,
    fsExistsSync,
    PARAMS,
    PARAM_KEYS,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    TaskKey,
} from '@rnv/core';

export const taskRnvHooksRun: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvHooksRun');

    if (fsExistsSync(c.paths.project.config)) {
        await executeTask(c, TaskKey.projectConfigure, TaskKey.hooksRun, originTask);
    } else {
        logInfo('Your are running your buildHook outside of renative project');
    }

    await buildHooks(c);

    if (!c.buildHooks) {
        return Promise.reject('Build hooks have not been compiled properly!');
    }

    let hookName = c.program?.exeMethod;
    let showHookList = false;

    if (!hookName || hookName === true) {
        showHookList = true;
    } else if (!c.buildHooks[hookName]) {
        showHookList = true;
    }

    if (Object.keys(c.buildHooks).length === 0) {
        return true;
    }

    if (showHookList) {
        const hooksList = Object.keys(c.buildHooks);

        const { selectedHook } = await inquirerPrompt({
            name: 'selectedHook',
            type: 'list',
            message: 'Pick an available hook:',
            choices: hooksList,
        });
        hookName = selectedHook;
    }
    await c.buildHooks[hookName](c);

    return true;
};

const Task: RnvTask = {
    description: 'Run specific build hook',
    fn: taskRnvHooksRun,
    task: TaskKey.hooksRun,
    params: PARAMS.withBase([PARAM_KEYS.exeMethod]),
    platforms: [],
    forceBuildHookRebuild: true,
    isGlobalScope: true,
};

export default Task;