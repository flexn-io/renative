/* eslint-disable import/no-cycle */
import open from 'better-opn';
import {
    isBuildSchemeSupported,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    waitForWebpack,
} from '../../common';
import { isPlatformSupported } from '../../platformTools';
import { logTask, logError } from '../../systemTools/logger';

import {
    MACOS,
    WINDOWS,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG
} from '../../constants';
import {
    runElectron,
    buildElectron,
    runElectronDevServer,
    configureElectronProject,
    exportElectron
} from '../../platformTools/electron';
import Config from '../../config';
import Analytics from '../../systemTools/analytics';
import { checkSdk } from '../../platformTools/sdkManager';


const TASKS = {};

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
        case MACOS:
        case WINDOWS:
            await configureIfRequired(c, platform);
            return runElectronDevServer(c, platform, port);
        default:
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
    switch (platform) {
        case MACOS:
        case WINDOWS:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
            }
            return runElectron(c, platform, port);
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
        case MACOS:
        case WINDOWS:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await configureElectronProject(c, platform);
                await buildElectron(c, platform);
            }
            return exportElectron(c, platform);
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c) => {
    logTask(`_taskBuild:${c.platform}`);
    const { platform } = c;

    // const engi getEngineByPlatform(c, c.platform)

    await checkSdk(c);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await configureElectronProject(c, platform);
            await buildElectron(c, platform);
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

const runTask = async (c, task) => {
    logTask(`runTask:engine-rn-electron:${c.platform}`);

    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });
    return TASKS[task](c);
};

export const _taskLog = async (c) => {
    logTask(`_taskLog:${c.platform}`);
    switch (c.platform) {
        default:
            logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_LOG] = _taskLog;

const applyTemplate = async () => true;

export default {
    runTask,
    applyTemplate
};
