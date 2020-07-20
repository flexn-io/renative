/* eslint-disable import/no-cycle */
import { logTask } from '../systemManager/logger';
import { copyRuntimeAssets, copySharedPlatforms } from '../projectManager/projectParser';
import { generateRuntimeConfig } from '../configManager/configParser';

export const taskRnvSwitch = c => new Promise((resolve, reject) => {
    const p = c.program.platform || 'all';
    logTask(`taskRnvSwitch:${p}`);

    copyRuntimeAssets(c)
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
        .then(() => resolve())
        .catch(e => reject(e));
});
