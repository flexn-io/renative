const isObject = (value: any) => value && typeof value === 'object' && value.constructor === Object;

const isArray = (value: any) => value && typeof value === 'object' && value.constructor === Array;

const isString = (value: any) => typeof value === 'string' || value instanceof String;

const isNumber = (value: any) => typeof value === 'number' && Number.isFinite(value);

const isFunction = (value: any) => typeof value === 'function';

const isBool = (value: any) => typeof value === 'boolean';

const isNull = (value: any) => value === null;

const isUndefined = (value: any) => typeof value === 'undefined';

const isRegExp = (value: any) => value && typeof value === 'object' && value.constructor === RegExp;

const isError = (value: any) => value instanceof Error && typeof value.message !== 'undefined';

const isDate = (value: any) => value instanceof Date;

const isSymbol = (value: any) => typeof value === 'symbol';

const isLikeNull = (value: any) => isNull(value) || isUndefined(value);

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
