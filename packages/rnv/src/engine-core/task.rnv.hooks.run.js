import { chalk, logTask } from '../core/systemManager/logger';
import { buildHooks } from '../core/projectManager/buildHooks';


export const taskRnvHooksRun = (c, parentTask, originTask) => new Promise((resolve, reject) => {
    logTask('taskRnvHooksRun', `parent:${parentTask} origin:${originTask}`);

    buildHooks(c)
        .then(() => {
            if (!c.buildHooks) {
                reject('Build hooks have not been compiled properly!');
                return;
            }
            if (c.buildHooks[c.program?.exeMethod]) {
                c.buildHooks[c.program?.exeMethod](c)
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                reject(
                    `Method name ${chalk().white(
                        c.program.exeMethod
                    )} does not exists in your buildHooks!`
                );
            }
        })
        .catch(e => reject(e));
});

export default {
    description: '',
    fn: taskRnvHooksRun,
    task: 'hooks',
    subTask: 'run',
    params: [],
    platforms: [],
};
