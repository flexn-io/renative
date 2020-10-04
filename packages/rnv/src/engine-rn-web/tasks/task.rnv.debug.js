import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { WEB, TIZEN, PARAMS } from '../../core/constants';
import { executeAsync } from '../../core/systemManager/exec';

export const taskRnvDebug = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);

    const { platform } = c;

    switch (platform) {
        case WEB:
        case TIZEN:
            return executeAsync(c, 'npx weinre --boundHost -all-');
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
        WEB,
        TIZEN
    ],
};
