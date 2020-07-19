/* eslint-disable import/no-cycle */
import { chalk, logTask } from '../systemManager/logger';
import { buildHooks } from '../projectManager/buildHooks';


export const rnvHooksRun = c => new Promise((resolve, reject) => {
    logTask('rnvHooksRun');

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
