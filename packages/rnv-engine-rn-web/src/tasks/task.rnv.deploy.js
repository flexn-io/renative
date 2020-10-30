import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { SDKWebpack } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    WEB,
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
    PARAMS
} = Constants;
const { deployWeb } = SDKWebpack;
const { executeOrSkipTask } = TaskManager;

export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    switch (platform) {
        case WEB:
            return deployWeb(c);
        case CHROMECAST:
            return deployWeb(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: 'deploy',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WEB,
        TIZEN,
        WEBOS,
        TIZEN_MOBILE,
        TIZEN_WATCH,
        KAIOS,
        FIREFOX_OS,
        FIREFOX_TV,
        CHROMECAST,
    ],
};
