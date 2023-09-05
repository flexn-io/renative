import { Constants, Logger, PlatformManager, RnvTaskFn } from 'rnv';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { MACOS, WINDOWS, LINUX, PARAMS } = Constants;

export const taskRnvDebug: RnvTaskFn = async (c) => {
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
    platforms: [MACOS, WINDOWS, LINUX],
};
