const isObject = value => value && typeof value === 'object' && value.constructor === Object;

const isArray = value => value && typeof value === 'object' && value.constructor === Array;

const isString = value => typeof value === 'string' || value instanceof String;

const isNumber = value => typeof value === 'number' && Number.isFinite(value);

const isFunction = value => typeof value === 'function';

const isBool = value => typeof value === 'boolean';

const isNull = value => value === null;

const isUndefined = value => typeof value === 'undefined';

const isRegExp = value => value && typeof value === 'object' && value.constructor === RegExp;

const isError = value => value instanceof Error && typeof value.message !== 'undefined';

const isDate = value => value instanceof Date;

const isSymbol = value => typeof value === 'symbol';

const isLikeNull = value => isNull(value) || isUndefined(value);

export {
    isObject,
    isArray,
    isString,
    isNumber,
    isFunction,
    isBool,
    isNull,
    isUndefined,
    isLikeNull,
    isRegExp,
    isError,
    isDate,
    isSymbol
};
