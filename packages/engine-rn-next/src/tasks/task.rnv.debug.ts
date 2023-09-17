import { RnvTaskFn, logErrorPlatform, logTask, WEB, CHROMECAST, PARAMS } from '@rnv/core';

export const taskRnvDebug: RnvTaskFn = async (c, parentTask) => {
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
    params: PARAMS.withBase(),
    platforms: [WEB, CHROMECAST],
};
