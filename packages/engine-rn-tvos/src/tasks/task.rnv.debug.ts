import { Constants, Logger, PlatformManager, RnvTaskFn } from 'rnv';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { PARAMS } = Constants;

export const taskRnvDebug: RnvTaskFn = async (c, parentTask) => {
    logTask('taskRnvDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Debug your app on target device or emulator',
    fn: taskRnvDebug,
    task: 'debug',
    params: PARAMS.withBase(),
    platforms: [],
};
