/* eslint-disable import/no-cycle */
import open from 'better-opn';

import {
    isBuildSchemeSupported,
    logErrorPlatform,
    waitForWebpack,
} from '../../common';
import { isPlatformSupported, configureGenericPlatform } from '../../platformTools';
import { configureGenericProject } from '../../projectTools';
import { logTask, logError } from '../../systemTools/logger';
import {
    WEB,
    CHROMECAST,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE
} from '../../constants';
import { deployWeb } from '../../platformTools/web';
import { runWebNext, buildWebNext, exportWebNext, deployWebNext, configureNextIfRequired } from '../../platformTools/web/webNext';
import Config from '../../config';
import Analytics from '../../systemTools/analytics';
import { checkSdk } from '../../platformTools/sdkManager';


const TASKS = {};

export const _taskConfigure = async (c) => {
    logTask('_taskConfigure');

    await configureGenericPlatform(c);
    await configureGenericProject(c);

    switch (c.platform) {
        case WEB:
        case CHROMECAST:
            return configureNextIfRequired(c);
        default:
            return logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_CONFIGURE] = _taskConfigure;

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

    if (!c.program.only) {
        await _taskConfigure(c);
    }

    switch (platform) {
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
    logTask('_taskRun', `port:${port} target:${target} hosted:${hosted}`);

    if (!c.program.only) {
        await _taskConfigure(c);
    }

    switch (platform) {
        case WEB:
        case CHROMECAST:
            c.runtime.shouldOpenBrowser = true;
            return runWebNext(c, platform, port, true);
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

    if (!c.program.only) {
        await _taskBuild(c);
    }

    switch (platform) {
        case WEB:
        case CHROMECAST:
            return exportWebNext(c);
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c) => {
    logTask(`_taskBuild:${c.platform}`);
    const { platform } = c;

    if (!c.program.only) {
        await _taskConfigure(c);
    }

    switch (platform) {
        case WEB:
        case CHROMECAST:
            await buildWebNext(c);
            return;
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c) => {
    logTask(`_taskDeploy:${c.platform}`);
    const { platform } = c;

    if (!c.program.only) {
        await _taskBuild(c);
    }

    switch (platform) {
        case WEB:
            return deployWebNext(c, platform);
        case CHROMECAST:
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
    logTask('runTask', '(engine-rn-next)');

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
