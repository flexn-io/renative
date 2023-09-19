import { fsExistsSync, fsReadFileSync, fsReaddirSync, fsWriteFileSync } from '../system/fs';

import path from 'path';
import { RnvApi } from './types';

const spinner: any = () => ({
    start: () => {
        //NOOP
    },
});

// const chalk: any = () => ({});
const logger: any = {};

export const generateApiDefaults = (): RnvApi => ({
    doResolve: () => {
        return undefined;
    },
    getConfigProp: <T>() => {
        return undefined as T;
    },
    logger,
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
