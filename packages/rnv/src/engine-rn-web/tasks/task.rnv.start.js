import open from 'better-opn';
import { getConfigProp } from '../../core/common';
import { logErrorPlatform } from '../../core/platformManager';
import { logTask, logError } from '../../core/systemManager/logger';
import { WEB,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    TASK_START,
    TASK_CONFIGURE,
    REMOTE_DEBUGGER_ENABLED_PLATFORMS,
    PARAMS } from '../../core/constants';
import { runWebpackServer, waitForWebpack } from '../../sdk-webpack';
import { executeTask } from '../../core/engineManager';

export const taskRnvStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${port} hosted:${!!hosted}`);

    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);
    }

    if (hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    const isWeinreEnabled = REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

    switch (platform) {
        case WEB:
        case TIZEN:
        case WEBOS:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            // c.runtime.keepSessionActive = true;
            return runWebpackServer(c, isWeinreEnabled);
        default:
            if (hosted) {
                return logError(
                    'This platform does not support hosted mode',
                    true
                );
            }
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: 'start',
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
