import { TaskManager, Constants, Logger, PlatformManager, RnvTaskFn } from 'rnv';
import { buildWeb } from '@rnv/sdk-webpack';

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

import { buildTizenProject } from '@rnv/sdk-tizen';
import { buildWebOSProject } from '@rnv/sdk-webos';
import { buildKaiOSProject } from '@rnv/sdk-kaios';
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
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
            await buildKaiOSProject(c);
            return;
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            await buildTizenProject(c);
            return;
        case WEBOS:
            await buildWebOSProject(c);
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
