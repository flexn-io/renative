export const matchRegEx = (str: string, regEx: RegExp, limit = 1000) => {
    if (str.length > limit) {
        throw new Error('Input too long');
    }
    return str.match(regEx);
};

// export const escapeRegExp = (pattern: RegExp | string) => {
//     if (typeof pattern === 'string') {
//         // eslint-disable-next-line
//         const escaped = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // convert the '/' into an escaped local file separator

//         return escaped.replace(/\//g, `\\${path.sep}`);
//     } else if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
//         return pattern.source.replace(/\//g, path.sep);
//     }
//     throw new Error(`Unexpected pattern: ${pattern}`);
// };

export const escapeRegEx = (str: string) => {
    return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};
