import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { deployWeb } from '@rnv/sdk-webpack';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    WEB,
    WEBTV,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    TASK_EXPORT,
    TASK_DEPLOY,
    PARAMS,
} = Constants;

const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    if (shouldSkipTask(c, TASK_DEPLOY, originTask)) return true;

    switch (platform) {
        case WEB:
        case WEBTV:
        case CHROMECAST:
            return deployWeb(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TASK_DEPLOY,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, WEBTV, TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH, KAIOS, FIREFOX_OS, FIREFOX_TV, CHROMECAST],
};
