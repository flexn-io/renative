/* eslint-disable import/no-cycle */
import open from 'better-opn';

import { configureGenericPlatform, logErrorPlatform } from '../core/platformManager';
import { configureGenericProject } from '../core/projectManager';
import { logTask, logError } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE
} from '../core/constants';
import { deployWeb, waitForWebpack } from '../sdk-webpack';
import { runWebNext, buildWebNext, exportWebNext, deployWebNext, configureNextIfRequired } from '../sdk-webpack/webNext';
import { executeTask as _executeTask } from '../core/engineManager';

import { taskRnvRun } from './task.rnv.run';

const TASKS = {};
TASKS[TASK_RUN] = taskRnvRun;

export const _taskConfigure = async (c, parentTask, originTask) => {
    logTask('_taskConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

    switch (c.platform) {
        case WEB:
        case CHROMECAST:
            return configureNextIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};
TASKS[TASK_CONFIGURE] = _taskConfigure;

export const _taskStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('_taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    await _executeTask(c, TASK_CONFIGURE, TASK_START, originTask);

    if (hosted) {
        return logError(
            'This platform does not support hosted mode',
            true
        );
    }
    switch (platform) {
        case WEB:
        case CHROMECAST:
            c.runtime.shouldOpenBrowser = false;
            return runWebNext(c, platform, port, true);
        default:
            return logErrorPlatform(c);
    }
};
TASKS[TASK_START] = _taskStart;

const _taskPackage = async (c, parentTask, originTask) => {
    logTask('_taskPackage', `parent:${parentTask}`);

    await _executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    return true;
};
TASKS[TASK_PACKAGE] = _taskPackage;

const _taskExport = async (c, parentTask, originTask) => {
    logTask('_taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case WEB:
        case CHROMECAST:
            return exportWebNext(c);
        default:
            logErrorPlatform(c);
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
            await buildWebNext(c);
            return;
        default:
            logErrorPlatform(c);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c, parentTask, originTask) => {
    logTask('_taskDeploy', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

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

const _taskDebug = async (c, parentTask) => {
    logTask('_taskDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            logErrorPlatform(c);
    }
};
TASKS[TASK_DEBUG] = _taskDebug;

export const _taskLog = async (c, parentTask) => {
    logTask('_taskLog', `parent:${parentTask}`);
    switch (c.platform) {
        default:
            logErrorPlatform(c);
    }
};
TASKS[TASK_LOG] = _taskLog;

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async () => true;

export default {
    executeTask,
    applyTemplate
};
