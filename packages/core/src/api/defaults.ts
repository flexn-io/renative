import { fsExistsSync, fsReadFileSync, fsReaddirSync, fsWriteFileSync } from '../system/fs';

import path from 'path';
import { RnvApi } from './types';

const spinner: any = () => ({
    start: () => {
        //NOOP
    },
});

export const generateApiDefaults = (): RnvApi => ({
    analytics: {
        captureEvent: () => {
            //NOOP
        },
    },
    prompt: {
        generateOptions() {
            //NOOP
        },
        inquirerPrompt: async () => {
            //NOOP
        },
        pressAnyKeyToContinue: async () => {
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
