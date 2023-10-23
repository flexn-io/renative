const isObject = (value: unknown) => value && typeof value === 'object' && value.constructor === Object;

const isArray = (value: unknown) => value && typeof value === 'object' && value.constructor === Array;

const isString = (value: unknown) => typeof value === 'string' || value instanceof String;

const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);

const isFunction = (value: unknown) => typeof value === 'function';

const isBool = (value: unknown) => typeof value === 'boolean';

const isNull = (value: unknown) => value === null;

const isUndefined = (value: unknown) => typeof value === 'undefined';

const isRegExp = (value: unknown) => value && typeof value === 'object' && value.constructor === RegExp;

const isError = (value: unknown) => value instanceof Error && typeof value.message !== 'undefined';

const isDate = (value: unknown) => value instanceof Date;

const isSymbol = (value: unknown) => typeof value === 'symbol';

const isLikeNull = (value: unknown) => isNull(value) || isUndefined(value);

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
    isSymbol,
};
