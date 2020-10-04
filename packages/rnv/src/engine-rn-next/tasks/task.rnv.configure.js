import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { WEB,
    CHROMECAST,
    TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { configureNextIfRequired } from '../../sdk-webpack/webNext';
import { executeTask } from '../../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

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
    task: 'configure',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
