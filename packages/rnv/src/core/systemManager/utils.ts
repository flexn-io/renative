import { RnvConfig } from '../configManager/types';
import { RenativeConfigVersion } from '../types';

export const isSystemMac = process.platform === 'darwin';

export const isSystemLinux = process.platform === 'linux';

export const isSystemWin = process.platform === 'win32';

export const replaceOverridesInString = (string: string, overrides: Array<string>, mask: string) => {
    let replacedString = string;
    if (overrides?.length && replacedString?.replace) {
        overrides.forEach((v) => {
            const regEx = new RegExp(v, 'g');
            replacedString = replacedString.replace(regEx, mask);
        });
    }
    return replacedString;
};

export const getValidLocalhost = (value: string, localhost: string) => {
    if (!value) return localhost;
    switch (value) {
        case 'localhost':
        case '0.0.0.0':
        case '127.0.0.1':
            return localhost;
        default:
            return value;
    }
};

export const isUrlLocalhost = (value: string) => {
    if (value?.includes) {
        if (value.includes('localhost')) return true;
        if (value.includes('0.0.0.0')) return true;
        if (value.includes('127.0.0.1')) return true;
    }
    return false;
};

export const getScopedVersion = (c: RnvConfig, key: string, val: RenativeConfigVersion, sourceObjKey: string) => {
    if (typeof val === 'string') {
        if (val.startsWith('source:')) {
            const sourceObj = c.buildConfig?.[sourceObjKey];
            if (sourceObj) {
                return sourceObj[key]?.version;
            }
        } else {
            return val;
        }
    } else {
        return val?.version;
    }
    return null;
};
