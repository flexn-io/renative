/* eslint-disable import/no-cycle */
import open from 'better-opn';
import ip from 'ip';
import path from 'path';

import {
    isBuildSchemeSupported,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    waitForWebpack,
} from '../../common';
import { isPlatformSupported } from '../../platformTools';
import { logTask, logError, logDebug } from '../../systemTools/logger';
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
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG
} from '../../constants';
import { buildWeb, runWeb, deployWeb, exportWeb } from '../../platformTools/web';
import { runTizen, buildTizenProject } from '../../platformTools/tizen';
import { runWebOS, buildWebOSProject } from '../../platformTools/webos';
import { runFirefoxProject, buildFirefoxProject } from '../../platformTools/firefox';
import { runChromecast } from '../../platformTools/chromecast';
import { copyFolderContentsRecursiveSync, writeCleanFile } from '../../systemTools/fileutils';
import { executeAsync } from '../../systemTools/exec';
import Config from '../../config';
import Analytics from '../../systemTools/analytics';
import { checkSdk } from '../../platformTools/sdkManager';


const TASKS = {};

const _configureHostedIfRequired = async (c) => {
    logTask(`_configureHostedIfRequired:${c.platform}`);
    if (Config.isWebHostEnabled) {
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

export const _taskStart = async (c) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask(
        `rnvStart:${platform}:${port}:${hosted}:${Config.isWebHostEnabled}`
    );

    if (Config.isWebHostEnabled && hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    switch (platform) {
        case WEB:
        case TIZEN:
        case WEBOS:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            await configureIfRequired(c, platform);
            return runWeb(c, platform, port);
        default:
            if (hosted) {
                return logError(
                    'This platform does not support hosted mode',
                    true
                );
            }
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_START] = _taskStart;

const _taskRun = async (c) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask(`_taskRun:${platform}:${port}:${target}:${hosted}`);
    if (Config.isWebHostEnabled && hosted) {
        c.runtime.shouldOpenBrowser = true;
        return _taskStart(c);
    }
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

const _taskPackage = async (c) => {
    logTask(`_taskPackage:${c.platform}`);
    const { platform } = c;

    await checkSdk(c);

    switch (platform) {
        default:
            logErrorPlatform(c, platform);
            return false;
    }
};
TASKS[TASK_PACKAGE] = _taskPackage;

const _taskExport = async (c) => {
    logTask(`_taskExport:${c.platform}`);
    const { platform } = c;

    await checkSdk(c);

    switch (platform) {
        case WEB:
            if (!c.program.only) {
                await _taskBuild(c);
            }
            return exportWeb(c, platform);
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c) => {
    logTask(`_taskBuild:${c.platform}`);
    const { platform } = c;

    await checkSdk(c);

    switch (platform) {
        case WEB:
        case CHROMECAST:
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await buildWeb(c, platform);
            return;
        case KAIOS:
        case FIREFOX_OS:
        case FIREFOX_TV:
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await buildFirefoxProject(c, platform);
            return;
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await buildTizenProject(c, platform);
            return;
        case WEBOS:
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await buildWebOSProject(c, platform);
            return;
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c) => {
    logTask(`_taskDeploy:${c.platform}`);
    const { platform } = c;

    switch (platform) {
        case WEB:
            if (!c.program.only) {
                await _taskBuild(c);
            }
            return deployWeb(c, platform);
        case CHROMECAST:
            if (!c.program.only) {
                await _taskBuild(c);
            }
            return deployWeb(c, platform);
        default:
            if (!c.program.only) {
                await _taskExport(c);
            }
    }
};
TASKS[TASK_DEPLOY] = _taskDeploy;

const _taskDebug = async (c) => {
    logTask(`_taskDebug:${c.platform}`);
    const { platform } = c;

    switch (platform) {
        case WEB:
        case TIZEN:
            return executeAsync(c, 'npx weinre --boundHost -all-');
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_DEBUG] = _taskDebug;

export const _taskLog = async (c) => {
    logTask(`_taskLog:${c.platform}`);
    switch (c.platform) {
        default:
            logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_LOG] = _taskLog;

const runTask = async (c, task) => {
    logTask(`runTask:engine-rn-web:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });
    return TASKS[task](c);
};

const applyTemplate = async () => true;

export default {
    runTask,
    applyTemplate
};
