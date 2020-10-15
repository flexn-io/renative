import ip from 'ip';
import path from 'path';

import { logErrorPlatform } from '../../core/platformManager';
import { logTask, logDebug } from '../../core/systemManager/logger';
import { WEB,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    TASK_RUN, TASK_START,
    TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { runWebpackServer } from '../../sdk-webpack';
import { getConfigProp, getPlatformProjectDir } from '../../core/common';
import { runTizen } from '../../sdk-tizen';
import { runWebOS } from '../../sdk-webos';
import { runFirefoxProject } from '../../sdk-firefox';
import { runChromecast } from '../../sdk-webpack/chromecast';
import { writeCleanFile } from '../../core/systemManager/fileutils';
import { executeTask, executeOrSkipTask } from '../../core/engineManager';

const _configureHostedIfRequired = async (c) => {
    logTask('_configureHostedIfRequired');

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
    const hostedShellHeaders = getConfigProp(c, c.platform, 'hostedShellHeaders', '');

    if (!bundleAssets) {
        logDebug('Running hosted build');
        const { rnv } = c.paths;
        writeCleanFile(
            path.join(rnv.dir, 'supportFiles', 'appShell', 'index.html'),
            path.join(getPlatformProjectDir(c), 'index.html'),
            [
                {
                    pattern: '{{DEV_SERVER}}',
                    override: `http://${ip.address()}:${c.runtime.port}`
                },
                {
                    pattern: '{{APPSHELL_HTML_HEADER}}',
                    override: String(hostedShellHeaders || '')
                },
            ], null, c
        );
    }
};

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (hosted) {
        c.runtime.shouldOpenBrowser = true;
        // return _taskStart(c);
        return executeTask(c, TASK_START, TASK_RUN, originTask);
    }

    switch (platform) {
        case WEB:
            c.runtime.shouldOpenBrowser = true;
            return runWebpackServer(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runTizen(c, target);
        case WEBOS:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runWebOS(c);
        case KAIOS:
        case FIREFOX_OS:
        case FIREFOX_TV:
            return runFirefoxProject(c);
        case CHROMECAST:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runChromecast(c, platform, target);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app in browser',
    fn: taskRnvRun,
    task: 'run',
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
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
