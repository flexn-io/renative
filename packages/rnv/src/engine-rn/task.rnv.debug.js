/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';

export const taskRnvDebug = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvDebug,
    task: 'debug',
    params: [],
    platforms: [],
};
