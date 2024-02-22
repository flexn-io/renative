import { fsExistsSync, fsReadFileSync, fsReaddirSync, fsWriteFileSync } from '../system/fs';

import path from 'path';
import { RnvApi } from './types';
import { doResolve } from '../system/resolve';
import { getConfigProp } from '../configs/configProp';

const spinner: any = () => ({
    start: () => {
        //NOOP
    },
    fail: () => {
        //NOOP
    },
    succeed: () => {
        //NOOP
    },
    text: '',
});

const defaultLog: any = (v: string) => {
    console.log(`DEFAULT LOGGER: ${v}`);
};
const defaultGetString = () => '';
const defaultGetBool = () => false;

export const generateApiDefaults = (): RnvApi => ({
    isDefault: true,
    doResolve,
    getConfigProp: getConfigProp,
    logger: {
        printArrIntoBox: defaultLog,
        getCurrentCommand: defaultGetString,
        isInfoEnabled: defaultGetBool,
        logAndSave: defaultLog,
        chalk: defaultLog,
        logAppInfo: defaultLog,
        logComplete: defaultLog,
        logDebug: defaultLog,
        logEnd: defaultLog,
        logError: defaultLog,
        logExitTask: defaultLog,
        logHook: defaultLog,
        logInfo: defaultLog,
        logInitialize: defaultLog,
        logInitTask: defaultLog,
        logRaw: defaultLog,
        logSuccess: defaultLog,
        logSummary: defaultLog,
        logTask: defaultLog,
        logToSummary: defaultLog,
        logWarning: defaultLog,
        logWelcome: defaultLog,
        printBoxEnd: defaultLog,
        printBoxStart: defaultLog,
        printIntoBox: defaultLog,
    },
    analytics: {
        captureEvent: () => {
            //NOOP
        },
        captureException() {
            //NOOP
        },
        teardown: async () => {
            //NOOP
        },
    },
    prompt: {
        generateOptions() {
            //NOOP
            return {
                asString: '',
                keysAsArray: [],
                keysAsObject: {},
                optionsAsArray: [],
                valuesAsArray: [],
                valuesAsObject: {},
            };
        },
        inquirerPrompt: async () => {
            //NOOP
        },
        pressAnyKeyToContinue: async () => {
            //NOOP
        },
        inquirerSeparator() {
            //NOOP
        },
    },
    spinner: spinner,
    fsExistsSync,
    fsReadFileSync,
    fsReaddirSync,
    fsWriteFileSync,
    path,
});
