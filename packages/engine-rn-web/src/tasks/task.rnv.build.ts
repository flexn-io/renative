import { TaskManager, Constants, Logger, PlatformManager } from 'rnv';
import { buildWeb } from '@rnv/sdk-webpack';
import { SDKTizen, SDKWebos, SDKFirefox } from '../sdks';

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
    TASK_BUILD,
    TASK_PACKAGE,
    PARAMS,
} = Constants;

const { buildTizenProject } = SDKTizen;
const { buildWebOSProject } = SDKWebos;
const { buildFirefoxProject } = SDKFirefox;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);

    const { platform } = c;

    // Build aways bundles assets
    c.runtime.forceBundleAssets = true;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case WEB:
        case WEBTV:
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
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, WEBTV, TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH, KAIOS, FIREFOX_OS, FIREFOX_TV, CHROMECAST],
};
