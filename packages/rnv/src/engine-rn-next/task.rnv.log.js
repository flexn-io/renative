import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';


export const taskRnvLog = async (c, parentTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);
    switch (c.platform) {
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvLog,
    task: 'log',
    params: [],
    platforms: [],
    skipProjectSetup: true,
};
