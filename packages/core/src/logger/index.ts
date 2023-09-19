// import { Chalk } from 'chalk';
import { getApi } from '../api';
import { RnvApiChalk, RnvApiLogger } from '../api/types';

export const chalk = (): RnvApiChalk => getApi().logger.chalk();

export const logWelcome: RnvApiLogger['logWelcome'] = () => getApi().logger.logWelcome();

export const logAndSave: RnvApiLogger['logAndSave'] = (msg, skipLog?) => getApi().logger.logAndSave(msg, skipLog);

export const getCurrentCommand: RnvApiLogger['getCurrentCommand'] = (excludeDollar = false) =>
    getApi().logger.getCurrentCommand(excludeDollar);

export const logToSummary: RnvApiLogger['logToSummary'] = (v, sanitizePaths?) =>
    getApi().logger.logToSummary(v, sanitizePaths);

export const logRaw: RnvApiLogger['logRaw'] = (...args) => getApi().logger.logRaw(...args);

export const logSummary: RnvApiLogger['logSummary'] = (header?) => getApi().logger.logSummary(header);

export const logTask: RnvApiLogger['logTask'] = (task, customChalk?) => getApi().logger.logTask(task, customChalk);

export const logInitTask: RnvApiLogger['logInitTask'] = (task, customChalk?) =>
    getApi().logger.logInitTask(task, customChalk);

export const logExitTask: RnvApiLogger['logExitTask'] = (task, customChalk?) =>
    getApi().logger.logExitTask(task, customChalk);

export const logHook: RnvApiLogger['logHook'] = (hook = '', msg = '') => getApi().logger.logHook(hook, msg);

export const logWarning: RnvApiLogger['logWarning'] = (msg) => getApi().logger.logWarning(msg);

export const logInfo: RnvApiLogger['logInfo'] = (msg) => getApi().logger.logInfo(msg);

export const logDebug: RnvApiLogger['logDebug'] = (...args) => getApi().logger.logDebug(...args);

export const isInfoEnabled: RnvApiLogger['isInfoEnabled'] = () => getApi().logger.isInfoEnabled();

export const logComplete: RnvApiLogger['logComplete'] = (isEnd) => getApi().logger.logComplete(isEnd);

export const logSuccess: RnvApiLogger['logSuccess'] = (msg) => getApi().logger.logSuccess(msg);

export const logError: RnvApiLogger['logError'] = (e, isEnd, skipAnalytics) =>
    getApi().logger.logError(e, isEnd, skipAnalytics);

export const logEnd: RnvApiLogger['logEnd'] = (code) => getApi().logger.logEnd(code);

export const logInitialize: RnvApiLogger['logInitialize'] = () => getApi().logger.logInitialize();

export const logAppInfo: RnvApiLogger['logAppInfo'] = (c) => getApi().logger.logAppInfo(c);

export const printIntoBox: RnvApiLogger['printIntoBox'] = (str) => getApi().logger.printIntoBox(str);

export const printArrIntoBox: RnvApiLogger['printArrIntoBox'] = (arr, prefix?) =>
    getApi().logger.printArrIntoBox(arr, prefix);

export const printBoxStart: RnvApiLogger['printBoxStart'] = (str, str2?) => getApi().logger.printBoxStart(str, str2);

export const printBoxEnd: RnvApiLogger['printBoxEnd'] = () => getApi().logger.printBoxEnd();
