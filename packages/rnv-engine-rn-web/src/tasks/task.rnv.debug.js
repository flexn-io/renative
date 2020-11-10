import { Constants, Logger, PlatformManager, Exec } from 'rnv';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WEB, WEBTV, TIZEN, PARAMS } = Constants;
const { executeAsync } = Exec;

export const taskRnvDebug = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);

    const { platform } = c;

    switch (platform) {
        case WEB:
        case WEBTV:
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
        WEBTV,
        TIZEN
    ],
};
