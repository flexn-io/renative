import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import { MACOS, WINDOWS } from '../core/constants';

export const taskRnvDebug = async (c) => {
    logTask('taskRnvDebug');
    const { platform } = c;

    switch (platform) {
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvDebug,
    task: 'debug',
    params: [],
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
