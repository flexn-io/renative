import { TaskManager, Constants, Logger, PlatformManager, RnvTaskFn } from 'rnv';
import { SDKNext } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WEB, CHROMECAST, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, PARAMS } = Constants;
const { configureNextIfRequired } = SDKNext;
const { executeTask, shouldSkipTask } = TaskManager;

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case WEB:
        case CHROMECAST:
            return configureNextIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, CHROMECAST],
};
