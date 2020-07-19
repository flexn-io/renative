/* eslint-disable import/no-cycle */
import { initializeTask } from '../engineManager';
import { logTask } from '../systemManager/logger';
import {
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT,
    TASK_DEPLOY, TASK_START, TASK_DEBUG, TASK_LOG, TASK_CONFIGURE
} from '../constants';

export const rnvConfigure = async (c) => {
    logTask('rnvConfigure');
    return initializeTask(c, TASK_CONFIGURE);
};

export const rnvStart = async (c) => {
    logTask('rnvStart');
    return initializeTask(c, TASK_START);
};

export const rnvDebug = async (c) => {
    logTask('rnvDebug');
    return initializeTask(c, TASK_DEBUG);
};

export const rnvRun = async (c) => {
    logTask('rnvRun');
    return initializeTask(c, TASK_RUN);
};

export const rnvPackage = async (c) => {
    logTask('rnvPackage');
    return initializeTask(c, TASK_PACKAGE);
};

export const rnvBuild = async (c) => {
    logTask('rnvBuild');
    return initializeTask(c, TASK_BUILD);
};

export const rnvExport = async (c) => {
    logTask('rnvExport');
    return initializeTask(c, TASK_EXPORT);
};

export const rnvDeploy = async (c) => {
    logTask('rnvDeploy');
    return initializeTask(c, TASK_DEPLOY);
};

export const rnvLog = async (c) => {
    logTask('rnvLog');
    return initializeTask(c, TASK_LOG);
};
