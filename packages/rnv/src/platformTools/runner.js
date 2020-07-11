/* eslint-disable import/no-cycle */
// @todo fix circular
import { getEngineRunner } from '../engineTools';
import { logTask } from '../systemTools/logger';
import {
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT,
    TASK_DEPLOY, TASK_START, TASK_DEBUG, TASK_LOG, TASK_CONFIGURE
} from '../constants';

const _runTask = (c, task) => {
    c.runtime.task = task;
    return getEngineRunner(c).runTask(c, task);
};

export const rnvConfigure = async (c) => {
    logTask('rnvConfigure');
    return _runTask(c, TASK_CONFIGURE);
};

export const rnvStart = async (c) => {
    logTask('rnvStart');
    return _runTask(c, TASK_START);
};

export const rnvDebug = async (c) => {
    logTask('rnvDebug');
    return _runTask(c, TASK_DEBUG);
};

export const rnvRun = async (c) => {
    logTask('rnvRun');
    return _runTask(c, TASK_RUN);
};

export const rnvPackage = async (c) => {
    logTask('rnvPackage');
    return _runTask(c, TASK_PACKAGE);
};

export const rnvBuild = async (c) => {
    logTask('rnvBuild');
    return _runTask(c, TASK_BUILD);
};

export const rnvExport = async (c) => {
    logTask('rnvExport');
    return _runTask(c, TASK_EXPORT);
};

export const rnvDeploy = async (c) => {
    logTask('rnvDeploy');
    return _runTask(c, TASK_DEPLOY);
};

export const rnvLog = async (c) => {
    logTask('rnvLog');
    return _runTask(c, TASK_LOG);
};
