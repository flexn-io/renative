export const matchRegEx = (str: string, regEx: RegExp, limit = 1000) => {
    if (str.length > limit) {
        throw new Error('Input too long');
    }
    return str.match(regEx);
};
