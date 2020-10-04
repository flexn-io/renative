import { logErrorPlatform } from '../../core/platformManager';
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
    TASK_BUILD, TASK_PACKAGE,
    PARAMS } from '../../core/constants';
import { buildWeb } from '../../sdk-webpack';
import { buildTizenProject } from '../../sdk-tizen';
import { buildWebOSProject } from '../../sdk-webos';
import { buildFirefoxProject } from '../../sdk-firefox';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    switch (platform) {
        case WEB:
        case CHROMECAST:
            await buildWeb(c);
            return;
        case KAIOS:
        case FIREFOX_OS:
        case FIREFOX_TV:
            await buildFirefoxProject(c, platform);
            return;
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            await buildTizenProject(c, platform);
            return;
        case WEBOS:
            await buildWebOSProject(c, platform);
            return;
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: 'build',
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
