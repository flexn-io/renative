import { logErrorPlatform, copySharedPlatforms } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { WEB,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { configureWebProject } from '../../sdk-webpack';
import { configureTizenProject } from '../../sdk-tizen';
import { configureWebOSProject } from '../../sdk-webos';
import { configureKaiOSProject } from '../../sdk-firefox';
import { configureChromecastProject } from '../../sdk-webpack/chromecast';
import { executeTask } from '../../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case WEB:
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
