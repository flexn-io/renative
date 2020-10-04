import { chalk, logTask } from '../../core/systemManager/logger';
import { buildHooks } from '../../core/projectManager/buildHooks';
import { executeTask } from '../../core/engineManager';
import { TASK_HOOKS_RUN, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


export const taskRnvHooksRun = async (c, parentTask, originTask) => {
    logTask('taskRnvHooksRun');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_HOOKS_RUN, originTask);

    await buildHooks(c);

    if (!c.buildHooks) {
        return Promise.reject('Build hooks have not been compiled properly!');
    }
    if (c.buildHooks[c.program?.exeMethod]) {
        await c.buildHooks[c.program?.exeMethod](c);
    } else {
        return Promise.reject(
            `Method name ${chalk().white(
                c.program.exeMethod
            )} does not exists in your buildHooks!`
        );
    }
    return true;
};

export default {
    description: 'Run specific build hook',
    fn: taskRnvHooksRun,
    task: TASK_HOOKS_RUN,
    params: PARAMS.withBase(),
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true,
};
