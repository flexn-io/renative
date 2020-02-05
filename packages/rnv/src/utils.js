
export const isSystemMac = process.platform === 'darwin';

export const isSystemLinux = process.platform === 'linux';

export const isSystemWin = process.platform === 'win32';

export const replaceOverridesInString = (string, overrides, mask) => {
    let replacedString = string;
    if (overrides?.length && replacedString?.replace) {
        overrides.forEach((v) => {
            const regEx = new RegExp(v, 'g');
            replacedString = replacedString.replace(regEx, mask);
        });
    }
    return replacedString;
};
