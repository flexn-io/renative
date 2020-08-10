import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
} from '../core/constants';

export const taskRnvDebug = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Debug your app on target device or emulator',
    fn: taskRnvDebug,
    task: 'debug',
    params: [],
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
