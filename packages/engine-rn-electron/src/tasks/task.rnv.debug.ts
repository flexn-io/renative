import { RnvTaskFn, logErrorPlatform, logTask, MACOS, WINDOWS, LINUX, PARAMS } from '@rnv/core';

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
