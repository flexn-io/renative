/* eslint-disable import/no-cycle */

import { IOS,
    TVOS,
    ANDROID,
    WEB,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    MACOS,
    WINDOWS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    TASK_RUN, TASK_CONFIGURE, TASK_BUILD, TASK_INFO } from '../../constants';

import { buildWeb, runWeb, deployWeb, exportWeb } from '../../platformTools/web';
import { runWebOS } from '../../platformTools/webos';
import { runTizen } from '../../platformTools/tizen';
import { runFirefoxProject } from '../../platformTools/firefox';
import { runChromecast } from '../../platformTools/chromecast';
import {
    isBuildSchemeSupported,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    getConfigProp,
    waitForWebpack,
    confirmActiveBundler
} from '../../common';

const TASKS = {};

const _taskRun = async (c) => {
    const { platform } = c;
    switch (platform) {
        case WEB:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
            }
            c.runtime.shouldOpenBrowser = true;
            return runWeb(c, platform, port, true);
            // return runWebNext(c, platform, port, true);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await _configureHostedIfRequired(c);
            }
            return runTizen(c, platform, target);
        case WEBOS:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await _configureHostedIfRequired(c);
            }
            return runWebOS(c, platform, target);
        case KAIOS:
        case FIREFOX_OS:
        case FIREFOX_TV:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
            }
            return runFirefoxProject(c, platform);
        case CHROMECAST:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await _configureHostedIfRequired(c);
            }
            return runChromecast(c, platform, target);
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_RUN] = _taskRun;

const runTask = (c, task) => TASKS[task](c);

export default {
    runTask
};
