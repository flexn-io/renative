import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { SDKTizen, SDKWebos, SDKFirefox, SDKWebpack } from '../sdks';

const { logErrorPlatform, copySharedPlatforms } = PlatformManager;
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
    TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE,
    PARAMS
} = Constants;
const { configureWebProject, configureChromecastProject } = SDKWebpack;
const { configureTizenProject } = SDKTizen;
const { configureWebOSProject } = SDKWebos;
const { configureKaiOSProject } = SDKFirefox;
const { executeTask } = TaskManager;

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case WEB:
        case WEBTV:
            return configureWebProject(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return configureTizenProject(c);
        case WEBOS:
            return configureWebOSProject(c);
        case CHROMECAST:
            return configureChromecastProject(c);
        case FIREFOX_OS:
        case FIREFOX_TV:
        case KAIOS:
            return configureKaiOSProject(c);
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
        WEBTV,
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
