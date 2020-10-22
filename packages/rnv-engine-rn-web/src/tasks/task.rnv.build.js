import { EngineManager, Constants, Logger, PlatformManager, SDKTizen, SDKWebos, SDKFirefox, SDKWebpack } from 'rnv';

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
    TASK_BUILD, TASK_PACKAGE,
    PARAMS
} = Constants;
const { buildWeb } = SDKWebpack;
const { buildTizenProject } = SDKTizen;
const { buildWebOSProject } = SDKWebos;
const { buildFirefoxProject } = SDKFirefox;
const { executeOrSkipTask } = EngineManager;

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
