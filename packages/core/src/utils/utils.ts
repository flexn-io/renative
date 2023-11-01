export const isSystemMac = process.platform === 'darwin';

export const isSystemLinux = process.platform === 'linux';

export const isSystemWin = process.platform === 'win32';

export const replaceOverridesInString = (string: string | undefined, overrides: Array<string>, mask: string) => {
    if (!string) return '';
    let replacedString = string;
    if (overrides?.length && replacedString?.replace) {
        overrides.forEach((v) => {
            const regEx = new RegExp(v, 'g');
            replacedString = replacedString.replace(regEx, mask);
        });
    }
    return replacedString;
};

export const isUrlLocalhost = (value: string) => {
    if (value?.includes) {
        if (value.includes('localhost')) return true;
        if (value.includes('0.0.0.0')) return true;
        if (value.includes('127.0.0.1')) return true;
    }
    return false;
};

export const objectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
    return Object.keys(obj) as (keyof Obj)[];
};
