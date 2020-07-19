/* eslint-disable import/no-cycle */
import { logToSummary, logTask } from '../systemManager/logger';
import { generateOptions } from '../../cli/prompt';
import { buildHooks } from '../projectManager/buildHooks';


export const rnvHooksList = c => new Promise((resolve, reject) => {
    logTask('rnvHooksList');

    buildHooks(c)
        .then(() => {
            if (c.buildHooks) {
                const hookOpts = generateOptions(c.buildHooks);
                let hooksAsString = `\n${'Hooks:'}\n${hookOpts.asString}`;

                if (c.buildPipes) {
                    const pipeOpts = generateOptions(c.buildPipes);
                    hooksAsString += `\n${'Pipes:'}\n${pipeOpts.asString}`;
                }
                logToSummary(hooksAsString);
                resolve();
            } else {
                reject('Your buildHooks object is empty!');
            }
        })
        .catch(e => reject(e));
});
