import { chalk, logTask } from '../core/systemManager/logger';
import { buildHooks } from '../core/projectManager/buildHooks';

export const taskRnvHooksRun = async (c, parentTask, originTask) => {
    logTask('taskRnvHooksRun', `parent:${parentTask} origin:${originTask}`);

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
    description: '',
    fn: taskRnvHooksRun,
    task: 'hooks run',
    params: [],
    platforms: [],
    skipAppConfig: true,
    skipPlatforms: true,
};
