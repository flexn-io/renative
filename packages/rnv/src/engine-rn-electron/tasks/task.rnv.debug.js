import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { MACOS, WINDOWS, PARAMS } from '../../core/constants';

export const taskRnvDebug = async (c) => {
    logTask('taskRnvDebug');
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
    params: PARAMS.withBase(),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
