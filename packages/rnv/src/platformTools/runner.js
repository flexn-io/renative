/* eslint-disable import/no-cycle */
// @todo fix circular
import { getEngineRunner } from '../engineTools';
import { logTask } from '../systemTools/logger';
import {
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT,
    TASK_DEPLOY, TASK_START, TASK_DEBUG, TASK_LOG
} from '../constants';

export const rnvStart = async (c) => {
    logTask(`rnvStart:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_START);
};

export const rnvDebug = async (c) => {
    logTask(`rnvDebug:${c.platform}`);

    return getEngineRunner(c).runTask(c, TASK_DEBUG);
};

export const rnvRun = async (c) => {
    logTask(`rnvRun:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_RUN);
};

export const rnvPackage = async (c) => {
    logTask(`rnvPackage:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_PACKAGE);
};

export const rnvBuild = async (c) => {
    logTask(`rnvBuild:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_BUILD);
};

export const rnvExport = async (c) => {
    logTask(`rnvExport:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_EXPORT);
};

export const rnvDeploy = async (c) => {
    logTask(`rnvDeploy:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_DEPLOY);
};

export const rnvLog = async (c) => {
    logTask(`rnvLog:${c.platform}`);
    return getEngineRunner(c).runTask(c, TASK_LOG);
};
