/* eslint-disable import/no-cycle */
import { logTask } from '../core/systemManager/logger';
import { copyRuntimeAssets, copySharedPlatforms } from '../core/projectManager/projectParser';
import { generateRuntimeConfig } from '../core/configManager/configParser';

export const taskRnvSwitch = (c, parentTask, originTask) => new Promise((resolve, reject) => {
    logTask('taskRnvSwitch', `parent:${parentTask} origin:${originTask}`);

    copyRuntimeAssets(c)
        .then(() => copySharedPlatforms(c))
        .then(() => generateRuntimeConfig(c))
        .then(() => resolve())
        .catch(e => reject(e));
});

export default {
    description: '',
    fn: taskRnvSwitch,
    task: 'switch',
    params: [],
    platforms: [],
};
