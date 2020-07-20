/* eslint-disable import/no-cycle */
import open from 'better-opn';
import { getConfigProp } from '../core/common';
import { logErrorPlatform } from '../core/platformManager';
import { logTask, logError } from '../core/systemManager/logger';
import {
    WEB,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    TASK_START,
    TASK_CONFIGURE
} from '../core/constants';
import { runWeb, waitForWebpack } from '../sdk-webpack';
import Config from '../core/configManager/config';
import { executeTask as _executeTask } from '../core/engineManager';

const WEINRE_ENABLED_PLATFORMS = [TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH];


export const taskRnvStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${port} hosted:${!!hosted}`);

    await _executeTask(c, TASK_CONFIGURE, TASK_START, originTask);

    if (Config.isWebHostEnabled && hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    const isWeinreEnabled = WEINRE_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted;

    switch (platform) {
        case WEB:
        case TIZEN:
        case WEBOS:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return runWeb(c, isWeinreEnabled);
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
