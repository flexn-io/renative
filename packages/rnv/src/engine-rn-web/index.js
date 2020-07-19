/* eslint-disable import/no-cycle */
import open from 'better-opn';
import ip from 'ip';
import path from 'path';

import {
    logErrorPlatform,
    waitForWebpack,
    getConfigProp
} from '../core/common';
import { configureGenericPlatform } from '../core/platformManager';
import { configureGenericProject } from '../core/projectManager';
import { logTask, logError, logDebug } from '../core/systemManager/logger';
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
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE
} from '../core/constants';
import { buildWeb, runWeb, deployWeb, exportWeb, configureWebProject } from '../sdk-webpack';
import { runTizen, buildTizenProject, configureTizenProject } from '../sdk-tizen';
import { runWebOS, buildWebOSProject, configureWebOSProject } from '../sdk-webos';
import { runFirefoxProject, buildFirefoxProject, configureKaiOSProject } from '../sdk-firefox';
import { runChromecast, configureChromecastProject } from '../sdk-webpack/chromecast';
import { copyFolderContentsRecursiveSync, writeCleanFile } from '../core/systemManager/fileutils';
import { executeAsync } from '../core/systemManager/exec';
import Config from '../core/configManager/config';
import { executeTask as _executeTask } from '../core/engineManager';

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

const TASKS = {};

export const _taskConfigure = async (c, parentTask, originTask) => {
    logTask('_taskConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

    switch (c.platform) {
        case WEB:
            return configureWebProject(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return configureTizenProject(c);
        case WEBOS:
            return configureWebOSProject(c);
        case CHROMECAST:
            return configureChromecastProject(c);
        case FIREFOX_OS:
        case FIREFOX_TV:
        case KAIOS:
            return configureKaiOSProject(c);
        default:
            return logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_CONFIGURE] = _taskConfigure;

const WEINRE_ENABLED_PLATFORMS = [TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH];

export const _taskStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('_taskStart', `parent:${parentTask} port:${port} hosted:${!!hosted}`);

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
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_START] = _taskStart;

const _taskRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('_taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    if (Config.isWebHostEnabled && hosted) {
        c.runtime.shouldOpenBrowser = true;
        return _taskStart(c);
    }

    await _executeTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case WEB:
            c.runtime.shouldOpenBrowser = true;
            return runWeb(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runTizen(c, platform, target);
        case WEBOS:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runWebOS(c);
        case KAIOS:
        case FIREFOX_OS:
        case FIREFOX_TV:
            return runFirefoxProject(c, platform);
        case CHROMECAST:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runChromecast(c, platform, target);
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_RUN] = _taskRun;

const _taskPackage = async (c, parentTask, originTask) => {
    logTask('_taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    switch (platform) {
        default:
            logErrorPlatform(c, platform);
            return false;
    }
};
TASKS[TASK_PACKAGE] = _taskPackage;

const _taskExport = async (c, parentTask, originTask) => {
    logTask('_taskExport', `parent:${parentTask}`);

    const { platform } = c;

    await _executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case WEB:
            return exportWeb(c, platform);
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c, parentTask, originTask) => {
    logTask('_taskBuild', `parent:${parentTask}`);

    const { platform } = c;

    await _executeTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

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
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c, parentTask, originTask) => {
    logTask('_taskDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await _executeTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    switch (platform) {
        case WEB:
            return deployWeb(c, platform);
        case CHROMECAST:
            return deployWeb(c, platform);
        default:
            if (!c.program.only) {
                await _taskExport(c);
            }
    }
};
TASKS[TASK_DEPLOY] = _taskDeploy;

const _taskDebug = async (c, parentTask) => {
    logTask('_taskDebug', `parent:${parentTask}`);

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

export const _taskLog = async (c, parentTask) => {
    logTask('_taskLog', `parent:${parentTask}`);

    switch (c.platform) {
        default:
            logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_LOG] = _taskLog;

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async () => true;

export default {
    executeTask,
    applyTemplate
};
