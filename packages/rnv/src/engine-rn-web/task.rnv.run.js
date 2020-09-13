import ip from 'ip';
import path from 'path';

import { logErrorPlatform } from '../core/platformManager';
import { logTask, logDebug } from '../core/systemManager/logger';
import {
    WEB,
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
} from '../core/constants';
import { runWeb } from '../sdk-webpack';
import { runTizen } from '../sdk-tizen';
import { runWebOS } from '../sdk-webos';
import { runFirefoxProject } from '../sdk-firefox';
import { runChromecast } from '../sdk-webpack/chromecast';
import { copyFolderContentsRecursiveSync, writeCleanFile } from '../core/systemManager/fileutils';
import { executeTask, executeOrSkipTask } from '../core/engineManager';

const _configureHostedIfRequired = async (c) => {
    logTask('_configureHostedIfRequired');
    const { hosted } = c.program;

    if (hosted) {
        logDebug('Running hosted build');
        const { project, rnv } = c.paths;
        copyFolderContentsRecursiveSync(
            path.join(rnv.dir, 'supportFiles', 'appShell'),
            path.join(
                project.dir,
                'platformBuilds',
                `${c.runtime.appId}_${c.platform}`,
                'public'
            )
        );
        writeCleanFile(
            path.join(rnv.dir, 'supportFiles', 'appShell', 'index.html'),
            path.join(
                project.dir,
                'platformBuilds',
                `${c.runtime.appId}_${c.platform}`,
                'public',
                'index.html'
            ),
            [
                {
                    pattern: '{{DEV_SERVER}}',
                    override: `http://${ip.address()}:${c.runtime.port}`
                }
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

    if (hosted) {
        c.runtime.shouldOpenBrowser = true;
        // return _taskStart(c);
        await _configureHostedIfRequired(c);
        return executeTask(c, TASK_START, TASK_RUN, originTask);
    }

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case WEB:
            c.runtime.shouldOpenBrowser = true;
            return runWeb(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            if (!c.program.only) {
                await executeTask(c, TASK_START, TASK_RUN, originTask);
            }
            return runTizen(c, platform, target);
        case WEBOS:
            if (!c.program.only) {
                await executeTask(c, TASK_START, TASK_RUN, originTask);
            }
            return runWebOS(c);
        case KAIOS:
        case FIREFOX_OS:
        case FIREFOX_TV:
            return runFirefoxProject(c);
        case CHROMECAST:
            return runChromecast(c, platform, target);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app in browser',
    fn: taskRnvRun,
    task: 'run',
    params: [],
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
