import inquirer from 'inquirer';
import {
    logTask,
    logInfo,
    buildHooks,
    executeTask,
    fsExistsSync,
    TASK_HOOKS_RUN,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    PARAM_KEYS,
    RnvTaskFn,
} from 'rnv';

export const taskRnvHooksRun: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvHooksRun');

    if (fsExistsSync(c.paths.project.config)) {
        await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_HOOKS_RUN, originTask);
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

    if (showHookList) {
        const hooksList = Object.keys(c.buildHooks);

        const { selectedHook } = await inquirer.prompt({
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

export default {
    description: 'Run specific build hook',
    fn: taskRnvHooksRun,
    task: TASK_HOOKS_RUN,
    params: PARAMS.withBase([PARAM_KEYS.exeMethod]),
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true,
    forceBuildHookRebuild: true,
    isGlobalScope: true,
};
